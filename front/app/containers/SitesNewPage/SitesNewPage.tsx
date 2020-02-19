import * as React from 'react';
import SiteForm from 'components/SiteForm/SiteForm';
import { CreateSiteInput, SiteViewMutationInput } from 'types/globalTypes';
import CreateSiteMutation, {
  CreateSiteMutationFn,
} from 'mutations/CreateSiteMutation';
import SiteProvider from 'containers/SiteProvider';
import UpdateSiteViewMutation, {
  UpdateSiteViewMutationFn,
} from 'mutations/UpdateSiteViewMutation';
import { pathOr } from 'ramda';
import { serializeMutation } from 'utils/siteViewUpdater';
import { History, Location } from 'history';
import { match } from 'react-router';
import CreateSiteViewMutation, {
  CreateSiteViewMutationFn,
} from 'mutations/CreateSiteViewMutation';

interface SitesNewPageProps {
  match: match<{}>;
  history: History;
  location: Location;
}

class SitesNewPage extends React.PureComponent<SitesNewPageProps> {
  handleSave = (createSite: CreateSiteMutationFn) => (
    input: CreateSiteInput
  ) => {
    createSite({ variables: { input } }).then(res => {
      if (!res) return;
      const id = pathOr(
        null,
        ['data', 'createSite', 'site', 'siteView', 'id'],
        res
      ) as number | null;
      if (!id) return;
    });
  };

  render() {
    return (
      <SiteProvider id={0}>
        {site => (
          <CreateSiteMutation
            onCompleted={() => this.props.history.push('/sites')}>
            {createSite => (
              <SiteForm
                history={this.props.history}
                location={this.props.location}
                match={this.props.match}
                site={{ ...site, name: '' }}
                refresh={null}
                onSave={this.handleSave(createSite)}
              />
            )}
          </CreateSiteMutation>
        )}
      </SiteProvider>
    );
  }
}

export default SitesNewPage;
