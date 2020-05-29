import * as React from 'react';
import styled from 'styled-components';
import { Query, QueryComponentOptions } from 'react-apollo';
import { gql } from 'apollo-boost';
import { Table } from 'react-bootstrap';
import { SitesPageQuery } from 'types/SitesPageQuery';
import { SiteItem } from 'components/SiteItem';
import CollapsiblePanel from 'components/CollapsiblePanel';
import { History } from 'history';
import DeleteSiteMutation, {
  DeleteSiteMutationFn,
} from 'mutations/DeleteSiteMutations';
import ThemedButton from 'components/StyledComponents/index';

interface SitesPageProps {
  history: History;
}

const QUERY = gql`
  query SitesPageQuery {
    me {
      id
      ownSites {
        ...SiteItemFragment
      }
      editorSites {
        ...SiteItemFragment
      }
    }
  }

  ${SiteItem.fragment}
`;

const Container = styled.div`
  padding: 20px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
`;

const QueryComponent = (props: QueryComponentOptions<SitesPageQuery>) =>
  Query(props);

class SitesPage extends React.PureComponent<SitesPageProps> {
  handleCreateSite = () => {
    this.props.history.push('/sites/new');
  };

  handleSiteEdit = (id: number) => {
    this.props.history.push(`/sites/${id}/edit`);
  };

  handleSiteDelete = (deleteSite: DeleteSiteMutationFn) => (id: number) => {
    deleteSite({ variables: { input: { id } } });
  };

  render() {
    return (
      <QueryComponent query={QUERY}>
        {({ data, loading, error }) => {
          if (loading || error || !data || !data.me) {
            return null;
          }
          return (
            <Container>
              <CollapsiblePanel header="My Sites">
                {data.me.ownSites.length > 0 && (
                  <Table striped bordered condensed>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Subdomain</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      <DeleteSiteMutation>
                        {deleteSite => (
                          <>
                            {data!.me!.ownSites.map(site => (
                              <SiteItem
                                site={site}
                                key={site.subdomain}
                                onEdit={this.handleSiteEdit}
                                onDelete={this.handleSiteDelete(deleteSite)}
                              />
                            ))}
                          </>
                        )}
                      </DeleteSiteMutation>
                    </tbody>
                  </Table>
                )}
                {data.me.ownSites.length === 0 && 'No sites yet'}
              </CollapsiblePanel>
              <ButtonsContainer>
                <ThemedButton onClick={this.handleCreateSite}>
                  Create Site
                </ThemedButton>
              </ButtonsContainer>
              <CollapsiblePanel header="Editable Sites">
                {data.me.editorSites.length > 0 && (
                  <Table striped bordered condensed>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Subdomain</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.me.editorSites.map(site => (
                        <SiteItem
                          site={site}
                          key={site.subdomain}
                          onEdit={this.handleSiteEdit}
                        />
                      ))}
                    </tbody>
                  </Table>
                )}
                {data.me.editorSites.length === 0 && 'No sites yet'}
              </CollapsiblePanel>
            </Container>
          );
        }}
      </QueryComponent>
    );
  }
}

export default SitesPage;
