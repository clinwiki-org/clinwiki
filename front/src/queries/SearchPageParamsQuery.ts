import gql from 'graphql-tag';
import { QueryComponentOptions, Query } from '@apollo/client/react/components';
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
        zipcode
        radius
        lat
        long
      }
      crowdAggFilters {
        field
        values
        gte
        lte
        includeMissingFields
        zipcode
        radius
        lat
        long
      }
    }
  }
`;

export const SearchPageParamsQueryComponent = (props: QueryComponentOptions<SearchPageParamsQuery, SearchPageParamsQueryVariables>) => Query(props);
