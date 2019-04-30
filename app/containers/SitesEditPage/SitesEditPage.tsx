import * as React from 'react';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import {
  SitesEditPageQuery,
  SitesEditPageQueryVariables,
} from 'types/SitesEditPageQuery';
import SiteItem from 'components/SiteItem';
import SiteForm from 'components/SiteForm/SiteForm';
import UpdateSiteMutation, {
  UpdateSiteMutationFn,
} from 'mutations/UpdateSiteMutation';
import { UpdateSiteInput, CreateSiteInput } from 'types/globalTypes';
import { match } from 'react-router';
import { pick, path, prop } from 'ramda';

interface SitesEditPageProps {
  match: match<{ id: string }>;
}

const QUERY = gql`
  query SitesEditPageQuery($id: Int!) {
    site(id: $id) {
      ...SiteFormFragment
    }
  }

  ${SiteForm.fragment}
`;

class QueryComponent extends Query<
  SitesEditPageQuery,
  SitesEditPageQueryVariables
> {}

class SitesEditPage extends React.PureComponent<SitesEditPageProps> {
  handleSave = (updateSite: UpdateSiteMutationFn) => (
    input: CreateSiteInput,
  ) => {
    updateSite({
      variables: {
        input: { ...input, id: parseInt(this.props.match.params.id, 10) },
      },
    });
  };

  render() {
    return (
      <QueryComponent
        query={QUERY}
        variables={{ id: parseInt(this.props.match.params.id, 10) }}
      >
        {({ data, loading, error }) => {
          if (loading || error || !data || !data.site) {
            return null;
          }
          const form: CreateSiteInput = pick(['name', 'subdomain'], data.site);
          form.editorEmails = ((path(['site', 'editors'], data) || []) as {
            email: string;
          }[]).map(prop('email'));
          return (
            <UpdateSiteMutation>
              {mutate => (
                <SiteForm form={form} onSave={this.handleSave(mutate)} />
              )}
            </UpdateSiteMutation>
          );
        }}
      </QueryComponent>
    );
  }
}

export default SitesEditPage;
