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
  getViewValueByPath,
  serializeMutation
} from "utils/siteViewUpdater";
import UpdateSiteViewMutation, {
  UpdateSiteViewMutationFn
} from "mutations/UpdateSiteViewMutation";
import { History, Location } from "history";
import SearchForm from "./SearchForm";
import SiteViewsForm from "./SiteViewsForm";
import { SiteViewFragment } from "types/SiteViewFragment";

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

  handleSave = (updateSiteView: UpdateSiteViewMutationFn) => (
    mutations: SiteViewMutationInput[],
    siteView: SiteViewFragment
  ) => {
    updateSiteView({
      variables: {
        input: {
          mutations: mutations.map(serializeMutation),
          id: siteView.id,
          name: siteView.name,
          url: siteView.url,
          default: true
        }
      }
    });
  };

  handleAddMutation = (
    e: { currentTarget: { name: string; value: any } },
    siteView
  ) => {
    // console.log(e);
    const { name, value } = e.currentTarget;
    const mutation = createMutation(name, value);
    const view = updateView(siteView, this.state.mutations);
    const currentValue = getViewValueByPath(mutation.path, view);
    if (equals(value, currentValue)) return;
    this.setState({ mutations: [...this.state.mutations, mutation] }, () =>
      console.log("handleadd", mutation, view, currentValue)
    );
  };

  handleFormChange = (form: CreateSiteInput) => {
    this.setState({ form });
  };

  render() {
    const view = updateView(this.props.site.siteView, this.state.mutations);
    const path = trimPath(this.props.match.path);
    const allViews = this.props.siteViews;
    const site = this.props.site;
    return (
      <Switch>
        <Route
          path={`${path}/:id/edit`}
          render={props => (
            <SearchForm
              {...props}
              siteViews={allViews}
              site={site}
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
            />
          )}
        />
        {/* <Redirect to={`${path}/main`} /> */}
      </Switch>
    );
  }
}

export default SiteViewRouter;
