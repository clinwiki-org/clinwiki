import gql from 'graphql-tag';
import { QueryComponentOptions, Query } from 'react-apollo';
import { SearchPageParamsQuery, SearchPageParamsQueryVariables } from 'types/SearchPageParamsQuery';

export default gql`
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
        gte
        lte
        includeMissingFields
      }
      crowdAggFilters {
        field
        values
        gte
        lte
        includeMissingFields
      }
    }
  }
`;

export const SearchPageParamsQueryComponent = (props: QueryComponentOptions<SearchPageParamsQuery, SearchPageParamsQueryVariables>) => Query(props);
