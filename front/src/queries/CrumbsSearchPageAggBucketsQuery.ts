import { gql } from 'apollo-boost';
const AUTOSUGGEST_QUERY = gql`
  query CrumbsSearchPageAggBucketsQuery(
    $agg: String!
    $q: SearchQueryInput!
    $aggFilters: [AggFilterInput!]
    $crowdAggFilters: [AggFilterInput!]
    $page: Int!
    $pageSize: Int!
    $aggOptionsFilter: String
    $aggFields: [String!]!
    $crowdAggFields: [String!]!
    $url: String
  ) {
    autocomplete(
      aggFields: $aggFields
      crowdAggFields: $crowdAggFields
      url: $url
      params: {
        agg: $agg
        q: $q
        sorts: []
        aggFilters: $aggFilters
        crowdAggFilters: $crowdAggFilters
        aggOptionsFilter: $aggOptionsFilter
        aggOptionsSort: [{ id: "count", desc: true }]
        page: $page
        pageSize: $pageSize
      }
    ) {
      autocomplete {
        name
        isCrowd
        results {
          key
          docCount
        }
        __typename
      }
      __typename
    }
  }
`;

export default AUTOSUGGEST_QUERY;