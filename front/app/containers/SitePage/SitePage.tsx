import * as React from 'react';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
// @ts-ignore
import { SitePageQuery, SitePageQueryVariables } from 'types/SitePageQuery';

interface SitePageProps {}

const QUERY = gql`
  query SitePageQuery {
    me {
      id
    }
  }
`;

class QueryComponent extends Query<SitePageQuery, SitePageQueryVariables> {}

class SitePage extends React.PureComponent<SitePageProps> {
  render() {
    return (
      <QueryComponent query={QUERY}>
        {({ data, loading, error }) => <div>SitePage</div>}
      </QueryComponent>
    );
  }
}

export default SitePage;
