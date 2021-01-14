export const SEARCH_PAGE_HASH_MUTATION =`
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