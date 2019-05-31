import * as React from 'react';
import { CreateSiteInput, SiteViewMutationInput } from 'types/globalTypes';
import { equals, prop, last } from 'ramda';
import { FormControl, Button, Nav, NavItem } from 'react-bootstrap';
import styled from 'styled-components';
import { gql } from 'apollo-boost';
import { capitalize, trimPath } from 'utils/helpers';
import { SiteFragment } from 'types/SiteFragment';
import {
  updateView,
  createMutation,
  getViewValueByPath,
} from 'utils/siteViewUpdater';
import { Switch, Route, match, Redirect } from 'react-router';
import MainForm from './MainForm';
import SearchForm from './SearchForm';
import { StyledContainer } from './Styled';
import { Link } from 'react-router-dom';
import { History, Location } from 'history';
import WorkflowForm from './WorkflowForm';

interface SiteFormProps {
  match: match<{}>;
  site: SiteFragment;
  history: History;
  location: Location;
  onSave: (form: CreateSiteInput, mutations: SiteViewMutationInput[]) => void;
}

interface SiteFormState {
  form: CreateSiteInput;
  mutations: SiteViewMutationInput[];
  addEditorEmail: string;
  prevForm: CreateSiteInput | null;
}

const Container = styled.div`
  ul > li > a {
    color: white;

    &:hover {
      color: #333;
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
      editorEmails: [],
    },
    mutations: [],
    addEditorEmail: '',
    prevForm: null,
  };

  static fragment = gql`
    fragment SiteFormFragment on Site {
      name
      subdomain
      editors {
        email
      }
    }
  `;

  static getDerivedStateFromProps = (
    props: SiteFormProps,
    state: SiteFormState,
  ): SiteFormState | null => {
    const { name, subdomain, editors } = props.site;
    const editorEmails = editors.map(prop('email'));
    const form = {
      name,
      subdomain,
      editorEmails,
    };
    if (form && !equals(form, state.prevForm as any)) {
      return { ...state, form, prevForm: form };
    }
    return null;
  };

  handleSave = () => {
    this.props.onSave(this.state.form, this.state.mutations);
  };

  handleAddMutation = (e: { currentTarget: { name: string; value: any } }) => {
    const { name, value } = e.currentTarget;
    const mutation = createMutation(name, value);
    const view = updateView(this.props.site.siteView, this.state.mutations);
    const currentValue = getViewValueByPath(mutation.path, view);
    if (equals(value, currentValue)) return;
    this.setState({ mutations: [...this.state.mutations, mutation] });
  };

  handleFormChange = (form: CreateSiteInput) => {
    this.setState({ form });
  };

  renderTabs = () => {
    const path = trimPath(this.props.match.url);
    const sections = [
      { path: '/main', value: 'Main' },
      { path: '/search', value: 'Search' },
      { path: '/workflow', value: 'Workflow' },
    ];
    const activeKey = `/${last(this.props.location.pathname.split('/'))}`;
    return (
      <StyledNav
        bsStyle="pills"
        activeKey={activeKey}
        onSelect={key => this.props.history.push(`${path}${key}`)}
      >
        {sections.map(section => (
          <NavItem key={`${section.path}`} eventKey={`${section.path}`}>
            {section.value}
          </NavItem>
        ))}
      </StyledNav>
    );
  };

  render() {
    const view = updateView(this.props.site.siteView, this.state.mutations);
    const path = trimPath(this.props.match.path);
    return (
      <Container>
        {this.renderTabs()}
        <Switch>
          <Route
            path={`${path}/main`}
            render={() => (
              <MainForm
                form={this.state.form}
                onFormChange={this.handleFormChange}
              />
            )}
          />
          <Route
            path={`${path}/search`}
            render={() => (
              <SearchForm view={view} onAddMutation={this.handleAddMutation} />
            )}
          />
          <Route
            path={`${path}/workflow`}
            render={() => (
              <WorkflowForm
                view={view}
                onAddMutation={this.handleAddMutation}
              />
            )}
          />
          <Redirect to={`${path}/main`} />
        </Switch>
        <StyledContainer>
          <Button onClick={this.handleSave}>Save</Button>;
        </StyledContainer>
      </Container>
    );
  }
}

export default SiteForm;
