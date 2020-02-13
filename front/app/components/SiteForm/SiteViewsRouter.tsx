import * as React from "react";
import { CreateSiteInput, SiteViewMutationInput } from "types/globalTypes";
import { equals, prop, last } from "ramda";
import { FormControl, Button, Nav, NavItem } from "react-bootstrap";
import styled from "styled-components";
import { gql } from "apollo-boost";
import { Switch, Route, match, Redirect } from "react-router";
import { capitalize, trimPath } from "utils/helpers";
import { SiteFragment } from "types/SiteFragment";
import {
  updateView,
  createMutation,
  getViewValueByPath
} from "utils/siteViewUpdater";
import MainForm from "./MainForm";
import SearchForm from "./SearchForm";
import SiteViewsForm from "./SiteViewsForm";
import { StyledContainer } from "./Styled";
import { Link } from "react-router-dom";
import { History, Location } from "history";
import StudyForm from "./StudyForm";
import UpdateSiteViewMutation from "mutations/UpdateSiteViewMutation";

interface SiteViewRouterProps {
  match: match<{}>;
  site: SiteFragment;
  history: History;
  location: Location;
  siteViews: any;
  refresh: any;
  onAddMutation: any;
  getId: any;
  onSave?: (form: CreateSiteInput, mutations: SiteViewMutationInput[]) => void;
}

interface SiteViewRouterState {
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

class SiteViewRouter extends React.Component<
  SiteViewRouterProps,
  SiteViewRouterState
> {
  state: SiteViewRouterState = {
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

  // static getDerivedStateFromProps = (
  //   props: SiteViewRouterProps,
  //   state: SiteViewRouterState
  // ): SiteViewRouterState | null => {
  //   const { name, subdomain, skipLanding, editors } = props.site;
  //   const editorEmails = editors.map(prop("email"));
  //   const form = {
  //     name,
  //     subdomain,
  //     skipLanding,
  //     editorEmails
  //   };
  //   if (form && !equals(form, state.prevForm as any)) {
  //     return { ...state, form, prevForm: form };
  //   }
  //   return null;
  // };

  // handleSave = () => {
  //   this.props.onSave(this.state.form, this.state.mutations);
  // };

  // handleAddMutation = (e: { currentTarget: { name: string; value: any } }) => {
  //   const { name, value } = e.currentTarget;
  //   const mutation = createMutation(name, value);
  //   const view = updateView(this.props.site.siteView, this.state.mutations);
  //   const currentValue = getViewValueByPath(mutation.path, view);
  //   if (equals(value, currentValue)) return;
  //   this.setState({ mutations: [...this.state.mutations, mutation] }, () =>
  //     console.log("i'm here", this.state.mutations)
  //   );
  // };

  handleFormChange = (form: CreateSiteInput) => {
    this.setState({ form });
  };

  render() {
    const view = updateView(this.props.site.siteView, this.state.mutations);
    const path = trimPath(this.props.match.path);
    const allViews = this.props.siteViews;
    const site = this.props.site;
    return (
      <UpdateSiteViewMutation>
        {updateSiteView => (
          <Switch>
            <Route
              path={`${path}/:id/edit`}
              render={props => (
                <SearchForm
                  {...props}
                  siteViews={allViews}
                  onAddMutation={this.props.onAddMutation}
                  view={view}
                  siteViewId={this.props.location}
                />
              )}
            />
            <Route
              path={`${path}`}
              render={() => (
                <SiteViewsForm
                  siteViews={this.props.siteViews}
                  site={site}
                  refresh={this.props.refresh}
                  onAddMutation={this.props.onAddMutation}
                />
              )}
            />
            {/* <Redirect to={`${path}/main`} /> */}
          </Switch>
        )}
      </UpdateSiteViewMutation>
    );
  }
}

export default SiteViewRouter;
