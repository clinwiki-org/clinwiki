import * as React from "react";
import { CreateSiteInput, SiteViewMutationInput } from "types/globalTypes";
import { equals, prop, last } from "ramda";
import { FormControl, Button, Nav, NavItem } from "react-bootstrap";
import styled from "styled-components";
import { gql } from "apollo-boost";
import { capitalize, trimPath } from "utils/helpers";
import { SiteFragment } from "types/SiteFragment";
import {
  updateView,
  createMutation,
  getViewValueByPath
} from "utils/siteViewUpdater";
import { Switch, Route, match, Redirect } from "react-router";
import MainForm from "./MainForm";
import SearchForm from "./SearchForm";
import SiteViewsForm from "./SiteViewsForm";
import SiteViewsRouter from './SiteViewsRouter'
import SiteViewsList from "containers/SiteViewsPage/SiteViewsList";
import { StyledContainer } from "./Styled";
import { Link } from "react-router-dom";
import { History, Location } from "history";
import StudyForm from "./StudyForm";

interface SiteFormProps {
  match: match<{}>;
  site: SiteFragment;
  history: History;
  location: Location;
  onSave: (form: CreateSiteInput, mutations: SiteViewMutationInput[]) => void;
  refresh: any;
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
      name: "",
      subdomain: "",
      skipLanding: false,
      editorEmails: []
    },
    mutations: [],
    addEditorEmail: "",
    prevForm: null
  };

  static fragment = gql`
    fragment SiteFormFragment on Site {
      name
      subdomain
      skipLanding
      editors {
        email
      }
    }
  `;

  static getDerivedStateFromProps = (
    props: SiteFormProps,
    state: SiteFormState
  ): SiteFormState | null => {
    const { name, subdomain, skipLanding, editors } = props.site;
    const editorEmails = editors.map(prop("email"));
    const form = {
      name,
      subdomain,
      skipLanding,
      editorEmails
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
    this.setState({ mutations: [...this.state.mutations, mutation] }, () =>
      console.log(this.state.mutations)
    );
  };

  handleFormChange = (form: CreateSiteInput) => {
    this.setState({ form });
  };

  renderTabs = () => {
    const path = trimPath(this.props.match.url);
    const sections = [
      { path: "/main", value: "Main" },
      { path: "/siteviews", value: "Search Views" },
      { path: "/study", value: "Study" },
      // { path: "/siteViews", value: "Site Views" }
    ];


    const locationComponents = this.props.location.pathname.split("/");
    let activeKey = last(locationComponents);
    if (locationComponents[locationComponents.length - 2] === "study") {
      activeKey = "study";
    }
    activeKey = `/${activeKey}`;

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
        <h3 style={{ color: "white", marginLeft: 15 }}>
          {this.props.site.name}
        </h3>
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
            path={`${path}/siteviews`}
            render={(props) => (
              //@ts-ignore
              <SiteViewsRouter
              {...props}
              //@ts-ignore 
              siteViews={allViews}
              onAddMutation={this.handleAddMutation}/>
            )}
          />
          <Route
            path={`${path}/study`}
            render={routeProps => (
              <StudyForm
                {...routeProps}
                view={view}
                onAddMutation={this.handleAddMutation}
              />
            )}
          />
          {/* <Route
            path={`${path}/siteviews`}
            render={() => (
              <SiteViewsList
                site={this.props.site}
                refresh={this.props.refresh}
                match={this.props.match}
                history={this.props.history}
                location={this.props.location}
                onAddMutation={this.handleAddMutation}
              />
            )} */}
          />
          <Redirect to={`${path}/main`} />
        </Switch>
        <StyledContainer>
          <Button onClick={this.handleSave}>Save</Button>
        </StyledContainer>
      </Container>
    );
  }
}

export default SiteForm;
