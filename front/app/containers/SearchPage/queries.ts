import gql from 'graphql-tag';

export const SearchPageHashQuery = gql`
  query SearchPageHashQuery(
    $q: SearchQueryInput!
    $sorts: [SortInput!]
    $aggFilters: [AggFilterInput!]
    $crowdAggFilters: [AggFilterInput!]
    $page: Int
    $pageSize: Int
  ) {
    searchHash(
      params: {
        q: $q
        sorts: $sorts
        aggFilters: $aggFilters
        crowdAggFilters: $crowdAggFilters
        page: $page
        pageSize: $pageSize
      }
    )
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
      }
      crowdAggFilters {
        field
        values
        gte
        lte
      }
      page
      pageSize
    }
  }
`;
