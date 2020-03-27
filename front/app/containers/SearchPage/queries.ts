import gql from 'graphql-tag';

export const SearchPageHashMutation = gql`
  mutation SearchPageHashMutation(
    $q: SearchQueryInput!
    $sorts: [SortInput!]
    $aggFilters: [AggFilterInput!]
    $crowdAggFilters: [AggFilterInput!]
    $page: Int
    $pageSize: Int
  ) {
    provisionSearchHash(
      input: {
        params: {
          q: $q
          sorts: $sorts
          aggFilters: $aggFilters
          crowdAggFilters: $crowdAggFilters
          page: $page
          pageSize: $pageSize
        }
      }
    ) {
      searchHash {
        short
      }
    }
  }
`;

export const SearchPageParamsQuery = gql`
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
      page
      pageSize
    }
  }
`;
