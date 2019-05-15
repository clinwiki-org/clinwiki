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
import { History } from 'history';

interface SitesNewPageProps {
  history: History;
}

class SitesNewPage extends React.PureComponent<SitesNewPageProps> {
  handleSave = (
    createSite: CreateSiteMutationFn,
    updateSiteView: UpdateSiteViewMutationFn,
  ) => (input: CreateSiteInput, mutations: SiteViewMutationInput[]) => {
    createSite({ variables: { input } }).then(res => {
      if (!res) return;
      const id = pathOr(
        null,
        ['data', 'createSite', 'site', 'siteView', 'id'],
        res,
      ) as number | null;
      if (!id) return;
      updateSiteView({
        variables: {
          input: {
            id,
            mutations: mutations.map(serializeMutation),
          },
        },
      });
    });
  };

  render() {
    return (
      <SiteProvider id={0}>
        {site => (
          <UpdateSiteViewMutation
            onCompleted={() => this.props.history.push('/sites')}
          >
            {updateSiteView => (
              <CreateSiteMutation>
                {createSite => (
                  <SiteForm
                    site={{ ...site, name: '' }}
                    onSave={this.handleSave(createSite, updateSiteView)}
                  />
                )}
              </CreateSiteMutation>
            )}
          </UpdateSiteViewMutation>
        )}
      </SiteProvider>
    );
  }
}

export default SitesNewPage;
