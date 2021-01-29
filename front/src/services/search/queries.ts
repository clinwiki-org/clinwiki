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

export const SEARCH_PAGE_PARAMS_QUERY= `
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
  ) {
    aggBuckets(
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
