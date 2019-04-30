import * as React from 'react';
import styled from 'styled-components';
import SiteForm from 'components/SiteForm/SiteForm';
import { CreateSiteInput } from 'types/globalTypes';
import CreateSiteMutation, {
  CreateSiteMutationFn,
} from 'mutations/CreateSiteMutation';

interface SitesNewPageProps {}

class SitesNewPage extends React.PureComponent<SitesNewPageProps> {
  handleSave = (createSite: CreateSiteMutationFn) => (
    input: CreateSiteInput,
  ) => {
    createSite({ variables: { input } });
  };

  render() {
    return (
      <CreateSiteMutation>
        {mutate => <SiteForm onSave={this.handleSave(mutate)} />}
      </CreateSiteMutation>
    );
  }
}

export default SitesNewPage;
