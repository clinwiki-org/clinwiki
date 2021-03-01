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

export const CREATE_SAVED_SEARCH_MUTATION = `
  mutation CreateSavedSearchMutation($searchHash: String!, $url: String!){
  createSavedSearch(input: {
    searchHash: $searchHash,
    url: $url
  }) {
    savedSearch {
      shortLink
      {
        long
      	short
      }
      userId
      createdAt
      nameLabel
    }
    }
  }
`;

export const DELETE_SAVED_SEARCH_MUTATION = `
  mutation DeleteSavedSearchMutation($id: Int!){
  deleteSavedSearch(input: {
    id: $id
  }) {
      success
      errors
      savedSearch{
        id
        userId
        shortLink{
          short
          long
        }
        isSubscribed
      }
      }
  }
`;
const FACET_CONFIG_FRAGMENT =`
  fragment FacetConfigFragment on FacetConfig {
    mainConfig
  }
`;

export const UPDATE_FACET_CONFIG = `
  mutation UpdateFacetConfig($input: UpdateFacetConfigInput!) {
    updateFacetConfig(input: $input) {
      errors
    }
  }
`;