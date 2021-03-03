import * as React from 'react';
import {  SiteViewMutationInput } from 'types/globalTypes';
import { CreateSiteInput } from 'services/site/model/InputTypes';
import { equals, prop, last } from 'ramda';
import { Nav, NavItem } from 'react-bootstrap';
import styled from 'styled-components';
import { trimPath } from 'utils/helpers';
import { SiteFragment } from 'services/site/model/SiteFragment';
import { StyledContainer } from './Styled';
import {
  updateView,
  createMutation,
  getViewValueByPath,
  serializeMutation,
} from 'utils/siteViewUpdater';
import { Switch, Route, match, Redirect } from 'react-router';
import MainForm from './MainForm';
import SiteViewsRouter from './SiteViewsRouter';
import { History, Location } from 'history';
import StudyForm from './StudyForm';
import ThemedButton from 'components/StyledComponents/index';
import PagesForm from './PagesForm';
import { connect } from 'react-redux';
import { fetchSiteProvider, updateSiteView } from 'services/site/actions';
import { SiteViewFragment } from 'services/site/model/SiteViewFragment';

interface SiteFormProps {
  match: match<{}>;
  site: SiteFragment;
  history: History;
  location: Location;
  onSaveSite: (CreateSiteInput) => void;
  //fetchSiteProvider?: any;
  updateSiteView: any;
}

interface SiteFormState {
  form: CreateSiteInput;
  mutations: SiteViewMutationInput[];
  addEditorEmail: string;
  prevForm: CreateSiteInput | null;
  disableSubmit: boolean;
}

const Container = styled.div`
  ul > li > a {
    color: #333;

    &:hover {
      color: #white;
    }
  }
`;

const StyledNav = styled(Nav)`
  margin: 15px;
`;

class SiteForm extends React.Component<SiteFormProps, SiteFormState> {
  state: SiteFormState = {
    form: {
      name: '',
      subdomain: '',
      skipLanding: false,
      editorEmails: [],
    },
    disableSubmit: false,
    mutations: [],
    addEditorEmail: '',
    prevForm: null,
  };

  static getDerivedStateFromProps = (
    props: SiteFormProps,
    state: SiteFormState
  ): SiteFormState | null => {
    const {
      name,
      subdomain,
      skipLanding,
      hideDonation,
      editors,
      themes,
      userRank,
      reactionsConfig,
    } = props.site;
    const editorEmails = editors.map(prop('email')) as string[];
    const form = {
      name,
      subdomain,
      skipLanding,
      hideDonation,
      editorEmails,
      themes,
      userRank,
      reactionsConfig,
    };
    if (form && !equals(form, state.prevForm as any)) {
      return { ...state, form, prevForm: form };
    }
    return null;
  };
  handleSave = () => {
    if (this.state.mutations.length > 0) { 
      const view = this.props.site.siteView;
      let input =  {
        id: view.id,
        name: view.name,
        url: view.url,
        default: view.default,
        mutations: this.state.mutations.map(serializeMutation),
      }
      this.props.updateSiteView(this.props.site.id, input)
    }
    this.props.onSaveSite(this.state.form);
  };

  handleAddMutation = (e: { currentTarget: { name: string; value: any } }) => {
    const { name, value } = e.currentTarget;
    console.log(`mutation: ${name}=${value}`);
    const mutation = createMutation(name, value);
    const view = updateView(this.props.site.siteView as SiteViewFragment, this.state.mutations);
    const currentValue = getViewValueByPath(mutation.path, view);
    if (equals(value, currentValue)) return;
    this.setState({ mutations: [...this.state.mutations, mutation] }, () =>
      console.log('handleadd', mutation, view, currentValue));
  };

  handleFormChange = (form: CreateSiteInput) => {
    this.setState({ form });
  };

  handleThemeError = error => {
    this.setState({ disableSubmit: error });
  };

  renderTabs = () => {
    const path = trimPath(this.props.match.url);
    let sections;
    if (path === '/sites/new') {
      sections = [
        { path: '/main', value: 'Main' },
        { path: '/study', value: 'Study' },
      ];
    } else {
      sections = [
        { path: '/main', value: 'Main' },
        { path: '/siteviews', value: 'Views' },
        { path: '/study', value: 'Study' },
        { path: '/page', value: 'Page' },
      ];
    }

    const locationComponents = this.props.location.pathname.split('/');
    let activeKey = last(locationComponents);
    if (locationComponents[locationComponents.length - 2] === 'study') {
      activeKey = 'study';
    }
    activeKey = `/${activeKey}`;

    return (
      <StyledNav
        bsStyle="pills"
        activeKey={activeKey}
        onSelect={key => this.props.history.push(`${path}${key}`)}>
        {sections.map(section => (
          <NavItem key={`${section.path}`} eventKey={`${section.path}`}>
            {section.value}
          </NavItem>
        ))}
      </StyledNav>
    );
  };

  showSave = () => {
    // The pages that use this save button are a bit scattered.
    // I don't think the Views page actually makes use of this button but I'm not 100% sure
    const path = window.location.pathname;
    return path.endsWith("/main") || /edit\/study\/[^/]*/.test(path)
  }

  render() {
    const view = updateView(this.props.site.siteView as SiteViewFragment, this.state.mutations);
    const path = trimPath(this.props.match.path);
    return (
      <Container>
        <h3 style={{ color: '#333', marginLeft: 15 }}>
          {this.props.site.name}
        </h3>
        {this.renderTabs()}
        <Switch>
          <Route
            path={`${path}/main`}
            render={() => (
              <MainForm
                handleThemeError={this.handleThemeError}
                form={this.state.form}
                onFormChange={this.handleFormChange}
              />
            )}
          />
          <Route
            path={`${path}/siteviews`}
            render={props => (
              <SiteViewsRouter
                {...props}
                siteViews={this.props.site.siteViews}
                site={this.props.site}
              />
            )}
          />
          <Route                    
            path={`${path}/study`} 
            render={routeProps => (       //TODO Remove Study Tab and clean code.
              <StudyForm
                {...routeProps}
                view={view  as SiteViewFragment}
                onAddMutation={this.handleAddMutation}
              />
            )}
          />
          <Route
            path={`${path}/page`}
            render={routeProps => (
              <PagesForm
                {...routeProps}
                history={routeProps.history}
                site={this.props.site}
              />
            )}
          />
          <Redirect to={`${path}/main`} />
        </Switch>
        {this.showSave() ? (
          <StyledContainer>
            <ThemedButton
              disabled={this.state.disableSubmit}
              onClick={() => this.handleSave()}>
              Save
            </ThemedButton>
          </StyledContainer>
        ) : null}
      </Container>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  // fetchSiteProvider: (id?, url?) => dispatch(fetchSiteProvider(id, url)),
  updateSiteView: (id, input) => dispatch(updateSiteView(id, input))
})


export default connect(null, mapDispatchToProps) (SiteForm);
