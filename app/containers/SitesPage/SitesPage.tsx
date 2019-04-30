import * as React from 'react';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import { Table, Button } from 'react-bootstrap';
import { SitesPageQuery } from 'types/SitesPageQuery';
import SiteItem from 'components/SiteItem';
import CollapsiblePanel from 'components/CollapsiblePanel';
import { History } from 'history';

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

class QueryComponent extends Query<SitesPageQuery> {}

class SitesPage extends React.PureComponent<SitesPageProps> {
  handleCreateSite = () => {
    this.props.history.push('/sites/new');
  };

  handleSiteEdit = (id: number) => {
    this.props.history.push(`/sites/${id}/edit`);
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
                      {data.me.ownSites.map(site => (
                        <SiteItem
                          site={site}
                          key={site.subdomain}
                          onEdit={this.handleSiteEdit}
                        />
                      ))}
                    </tbody>
                  </Table>
                )}
                {data.me.ownSites.length === 0 && 'No sites yet'}
              </CollapsiblePanel>
              <ButtonsContainer>
                <Button onClick={this.handleCreateSite}>Create Site</Button>
              </ButtonsContainer>
              <CollapsiblePanel header="Editable Sites">
                {data.me.editorSites.length > 0 && (
                  <Table striped bordered condensed>
                    <thead>
                      <th>Name</th>
                      <th>Subdomain</th>
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
