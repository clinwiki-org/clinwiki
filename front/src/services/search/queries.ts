export const SEARCH_PAGE_AGGS_QUERY = `
  query SearchPageAggsQuery(
    $q: SearchQueryInput!
    $page: Int
    $pageSize: Int
    $sorts: [SortInput!]
    $aggFilters: [AggFilterInput!]
    $crowdAggFilters: [AggFilterInput!]
  ) {
    crowdAggs: aggBuckets(
      params: {
        q: $q
        page: 0
        pageSize: 100000
        sorts: $sorts
        aggFilters: $aggFilters
        crowdAggFilters: $crowdAggFilters
        agg: "front_matter_keys"
      }
    ) {
      aggs {
        buckets{
          key
        }
      }
    }
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
      aggs {
        name
      }
    }
  }
`;

// export const SEARCH_PAGE_PARAMS_QUERY = `
//   query SearchPageParamsQuery($hash: String) {
//     searchParams(hash: $hash) {
//       q
//       sorts {
//         id
//         desc
//       }
//       aggFilters {
//         field
//         values
//         gte
//         lte
//         includeMissingFields
//         zipcode
//         radius
//         lat
//         long
//       }
//       crowdAggFilters {
//         field
//         values
//         gte
//         lte
//         includeMissingFields
//         zipcode
//         radius
//         lat
//         long
//       }
//     }
//   }
// `;
export const SEARCH_PAGE_PARAMS_QUERY = `
  query SearchPageParamsQuery($hash: String) {
    searchParams(hash: $hash) {
      searchParams
    }
  }
`;
export const SEARCH_PAGE_SEARCH_QUERY = `
  query SearchPageSearchQuery(
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
      studies {
        ...StudyItemFragment
      }
    }
  }

  fragment StudyItemFragment on ElasticStudy {
    averageRating
    completionDate
    nctId
    overallStatus
    startDate
    briefTitle
    reviewsCount
    interventions
    facilityStates
    interventionsMeshTerms
    studyFirstSubmittedDate
    resultsFirstSubmittedDate
    dispositionFirstSubmittedDate
    lastUpdateSubmittedDate
    studyFirstSubmittedQcDate
    studyFirstPostedDate
    studyFirstPostedDateType
    studyViewCount
    resultsFirstSubmittedQcDate
    resultsFirstPostedDate
    resultsFirstPostedDateType
    dispositionFirstSubmittedQcDate
    dispositionFirstPostedDate
    dispositionFirstPostedDateType
    lastUpdateSubmittedQcDate
    lastUpdatePostedDate
    lastUpdatePostedDateType
    studyType
    acronym
    baselinePopulation
    officialTitle
    lastKnownStatus
    phase
    enrollment
    enrollmentType
    source
    numberOfArms
    numberOfGroups
    whyStopped
    hasExpandedAccess
    expandedAccessTypeTreatment
    isFdaRegulatedDrug
    isFdaRegulatedDevice
    ipdTimeFrame
    ipdAccessCriteria
    ipdUrl
    planToShareIpd
    planToShareIpdDescription
  }
`;

export const SEARCH_PAGE_AGG_BUCKETS_QUERY = `
  query SearchPageAggBucketsQuery(
    $agg: String!
    $q: SearchQueryInput!
    $aggFilters: [AggFilterInput!]
    $crowdAggFilters: [AggFilterInput!]
    $page: Int!
    $pageSize: Int!
    $aggOptionsFilter: String
    $aggOptionsSort: [SortInput!]
    $url: String
    $configType: String
    $returnAll: Boolean
    $aggBucketsWanted: VisibleOptions!
  ) {
    aggBuckets(
      url: $url
      configType: $configType
      returnAll: $returnAll
      aggBucketsWanted: $aggBucketsWanted
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
          keyAsString
          docCount
        }
      }
    }
  }
`;

export const SEARCH_PAGE_CROWD_AGG_BUCKETS_QUERY = `
  query SearchPageCrowdAggBucketsQuery(
    $agg: String!
    $q: SearchQueryInput!
    $aggFilters: [AggFilterInput!]
    $crowdAggFilters: [AggFilterInput!]
    $page: Int!
    $pageSize: Int!
    $aggOptionsFilter: String
    $aggOptionsSort: [SortInput!]
    $url: String
    $configType: String
    $returnAll: Boolean
    $bucketsWanted: [String!]
  ) {
    aggBuckets: crowdAggBuckets(
      url: $url
      configType: $configType
      returnAll: $returnAll
      bucketsWanted: $bucketsWanted
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
          keyAsString
          docCount
        }
      }
    }
  }
`;
export const SEARCH_PAGE_OPEN_CROWD_AGG_BUCKETS_QUERY = `
  query SearchPageOpenCrowdAggBucketsQuery(
    $agg: [String]
    $crowdAgg: [String]
    $q: SearchQueryInput!
    $aggFilters: [AggFilterInput!]
    $crowdAggFilters: [AggFilterInput!]
    $page: Int!
    $pageSize: Int!
    $aggOptionsFilter: String
    $aggOptionsSort: [SortInput!]
    $crowdAggOptionsSort: [SortInput!]
    $url: String
    $configType: String
    $returnAll: Boolean
    $aggBucketsWanted: [VisibleOptions!]
    $crowdBucketsWanted: [VisibleOptions!]
  ) {
    openAggBuckets(
      url: $url
      configType: $configType
      returnAll: $returnAll
      aggBucketsWanted: $aggBucketsWanted
      crowdBucketsWanted: $crowdBucketsWanted
      params: {
        agg: $agg
        crowdAgg: $crowdAgg
        q: $q
        sorts: []
        aggFilters: $aggFilters
        crowdAggFilters: $crowdAggFilters
        aggOptionsFilter: $aggOptionsFilter
        aggOptionsSort: $aggOptionsSort
        crowdAggOptionsSort: $crowdAggOptionsSort
        page: $page
        pageSize: $pageSize
      }
    ) {
      aggs {
        name
        buckets {
          key
          keyAsString
          docCount
        }
      }
    }
  }
`;
export const SEARCH_PAGE_OPEN_AGG_BUCKETS_QUERY = `
  query SearchPageOpenAggBucketsQuery(
    $agg: [String]
    $crowdAgg: [String]
    $q: SearchQueryInput!
    $aggFilters: [AggFilterInput!]
    $crowdAggFilters: [AggFilterInput!]
    $page: Int!
    $pageSize: Int!
    $aggOptionsFilter: String
    $aggOptionsSort: [SortInput!]
    $crowdAggOptionsSort: [SortInput!]
    $url: String
    $configType: String
    $returnAll: Boolean
    $aggBucketsWanted: [VisibleOptions!]
    $crowdBucketsWanted: [VisibleOptions!]
  ) {
    openAggBuckets(
      url: $url
      configType: $configType
      returnAll: $returnAll
      aggBucketsWanted: $aggBucketsWanted
      crowdBucketsWanted: $crowdBucketsWanted
      params: {
        agg: $agg
        crowdAgg: $crowdAgg
        q: $q
        sorts: []
        aggFilters: $aggFilters
        crowdAggFilters: $crowdAggFilters
        aggOptionsFilter: $aggOptionsFilter
        aggOptionsSort: $aggOptionsSort
        crowdAggOptionsSort: $crowdAggOptionsSort
        page: $page
        pageSize: $pageSize
      }
    ) {
      aggs {
        name
        buckets {
          key
          keyAsString
          docCount
        }
      }
    }
  }
`;

export const AUTOSUGGEST_QUERY = `
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

export const SAVED_SEARCHES_QUERY = `
query UserSavedSearchesQuery($userId: Int!){
    savedSearch(userId: $userId) {
        id
        userId
        nameLabel
        createdAt
        updatedAt
        isSubscribed
        url
        shortLink {
            long
            short
        }  
    }
} 
`;

export const HASURA_SAVED_SEARCHES_QUERY = `
query HasuraSavedSearchesQuery($userId: bigint!) {
  saved_searches(where: {user_id: {_eq: $userId}}) {
    id
    search_hash
    name_label
    url
    is_subscribed
    short_link_id
    created_at
    updated_at
    short_link {
      long
      short
    }
  }
}
`;

export const HASURA_SAVED_DOCS_QUERY = `
query HasuraSavedDocsQuery($userId: Int!) {
  saved_documents(where: {user_id: {_eq: $userId}}) {
    id
    name_label
    document_id
    is_subscribed
    url
    created_at
    updated_at
  }
}
`;

export const FIND_SHORT_LINK = `
  query findShortLink($searchHash: String){
    short_links(where: {short: {_eq: $searchHash}}) {
      id
      long
      short
    }
  }
`;

export const ISLAND_CONFIG_QUERY_ALL = `
query HasuraIslandConfigsQueryAll {
  island_configs {
    id
    island_type
    config
  }
}
`;

export const ISLAND_CONFIG_QUERY = `
query HasuraIslandConfigsQuery($idList: [Int!]) {
  island_configs(where: {id: {_in: $idList}}) {
    id
    island_type
    updated_at
    created_at
    config
  }
}
`;
export const SEARCH_EXPORT_QUERY = `
  query SearchExportQuery($searchExportId: Int!) {
    searchExport(searchExportId: $searchExportId) {
      downloadUrl
    }
  }
`;
