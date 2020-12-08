import { gql }  from '@apollo/client';
const SEARCH_PAGE_SEARCH_QUERY_NO_RESULTS = gql`
  query SearchPageSearchQueryNoResults(
    $q: SearchQueryInput!
    $page: Int
    $pageSize: Int
    $sorts: [SortInput!]
    $aggFilters: [AggFilterInput!]
    $crowdAggFilters: [AggFilterInput!]
  ) {
    search(
      params: {
        q: $q
        page: $page
        pageSize: $pageSize
        sorts: $sorts
        aggFilters: $aggFilters
        crowdAggFilters: $crowdAggFilters
      }
    ) {
      recordsTotal
    }
  }
`;
export default SEARCH_PAGE_SEARCH_QUERY_NO_RESULTS;