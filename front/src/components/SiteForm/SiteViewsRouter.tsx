import * as React from 'react';
import { CreateSiteInput, SiteViewMutationInput } from 'types/globalTypes';
import { Switch, Route, match } from 'react-router';
import { trimPath } from 'utils/helpers';
import { SiteFragment, SiteFragment_siteViews } from 'types/SiteFragment';
import { updateView } from 'utils/siteViewUpdater';
import { History, Location } from 'history';
import SearchForm from './SearchForm';
import SiteViewsForm from './SiteViewsForm';

interface SiteViewRouterProps {
  match: match<{}>;
  site: SiteFragment;
  history: History;
  location: Location;
  siteViews: SiteFragment_siteViews[];
  refresh: any;
  onSave?: (form: CreateSiteInput, mutations: SiteViewMutationInput[]) => void;
  handleSiteViewEdit?: any;
  handleForm: any;
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
      name: '',
      subdomain: '',
      skipLanding: false,
      editorEmails: [],
    },
    mutations: [],
    addEditorEmail: '',
    prevForm: null,
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
              handleSiteViewEdit={this.props.handleSiteViewEdit}
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
              handleForm={this.props.handleForm}
            />
          )}
        />
        {/* <Redirect to={`${path}/main`} /> */}
      </Switch>
    );
  }
}

export default SiteViewRouter;
