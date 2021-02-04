import * as React from 'react';
import { SiteViewMutationInput } from 'types/globalTypes';
import { CreateSiteInput } from 'services/site/model/InputTypes';
import { Switch, Route, match } from 'react-router';
import { trimPath } from 'utils/helpers';
import { SiteFragment, SiteFragment_siteViews } from 'services/site/model/SiteFragment';
import {
  updateView,
} from 'utils/siteViewUpdater';
import { History, Location } from 'history';
import SearchForm from './SearchForm';
import SiteViewsForm from './SiteViewsForm';
import { SiteViewFragment } from 'services/site/model/SiteViewFragment';

interface SiteViewRouterProps {
  match: match<{}>;
  site: SiteFragment;
  history: History;
  location: Location;
  siteViews: SiteFragment_siteViews[];
  onSave?: (form: CreateSiteInput, mutations: SiteViewMutationInput[]) => void;
  handleSiteViewEdit?: any;
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
    const view = updateView(this.props.site.siteView as SiteViewFragment, this.state.mutations);
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
              siteViews={this.props.siteViews as SiteViewFragment[]}
              site={site}
            />
          )}
        />
        {/* <Redirect to={`${path}/main`} /> */}
      </Switch>
    );
  }
}

export default SiteViewRouter;
