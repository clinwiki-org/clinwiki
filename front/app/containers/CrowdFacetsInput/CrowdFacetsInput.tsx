import * as React from 'react';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import {
  CrowdFacetsInputQuery,
  CrowdFacetsInputQueryVariables,
} from 'types/CrowdFacetsInputQuery';

interface CrowdFacetsInputProps {}

const QUERY = gql`
  query CrowdFacetsInputQuery($id: Int!) {
    site(id: $id) {
      id
    }
  }
`;

class QueryComponent extends Query<
  CrowdFacetsInputQuery,
  CrowdFacetsInputQueryVariables
> {}

class CrowdFacetsInput extends React.PureComponent<CrowdFacetsInputProps> {
  render() {
    return (
      <QueryComponent query={QUERY}>
        {({ data, loading, error }) => <div>CrowdFacetsInput</div>}
      </QueryComponent>
    );
  }
}

export default CrowdFacetsInput;
