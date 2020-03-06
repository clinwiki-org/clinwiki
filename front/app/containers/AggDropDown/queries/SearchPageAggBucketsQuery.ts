import gql from 'graphql-tag';

export default gql`
  query SearchPageAggBucketsQuery(
    $agg: String!
    $q: SearchQueryInput!
    $aggFilters: [AggFilterInput!]
    $crowdAggFilters: [AggFilterInput!]
    $page: Int!
    $pageSize: Int!
    $aggOptionsFilter: String
    $aggOptionsSort: [SortInput!]
  ) {
    aggBuckets(
      params: {
        agg: $agg
        q: $q
        sorts: []
        aggFilters: $aggFilters
        crowdAggFilters: $crowdAggFilters
        aggOptionsFilter: $aggOptionsFilter
        aggOptionsSort: $aggOptionsSort
        page: $page
        pageSize: $pageSize
      }
    ) {
      aggs {
        name
        buckets {
          key
          docCount
        }
      }
    }
  }
`;
