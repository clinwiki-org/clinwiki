import { gql } from 'apollo-boost';
const PARAMS_QUERY = gql`
  query SearchPageParamsQuery($hash: String) {
    searchParams(hash: $hash) {
      q
      sorts {
        id
        desc
      }
      aggFilters {
        field
        values
      }
      crowdAggFilters {
        field
        values
      }
      page
      pageSize
    }
  }
`;

export default PARAMS_QUERY;
