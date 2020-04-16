import gql from 'graphql-tag';

export default gql`
  query SearchPageCrowdAggBucketsQuery(
    $agg: String!
    $q: SearchQueryInput!
    $aggFilters: [AggFilterInput!]
    $crowdAggFilters: [AggFilterInput!]
    $page: Int!
    $pageSize: Int!
    $aggOptionsFilter: String
    $url: String
    $configType: String
    $returnAll: Boolean
  ) {
    aggBuckets: crowdAggBuckets(
      url: $url
      configType: $configType
      returnAll: $returnAll
      params: {
        agg: $agg
        q: $q
        sorts: []
        aggFilters: $aggFilters
        crowdAggFilters: $crowdAggFilters
        aggOptionsFilter: $aggOptionsFilter
        page: $page
        pageSize: $pageSize
      }
    ) {
      aggs {
        buckets {
          key
          keyAsString
          docCount
        }
      }
    }
  }
`;
