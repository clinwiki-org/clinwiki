//From globalTypes

/**
 * An input type for a search query param (q).
 * This is a tree like structure where leafs are the search terms and
 * tree nodes are the AND / OR conditions.
 */
export interface SearchQueryInput {
    key: string;
    children?: SearchQueryInput[] | null;
  }
  /**
 * Column to sort by
 */
export interface SortInput {
    id: string;
    desc?: boolean | null;
  }
  
/**
 * An Agg Filter
 */
  
export interface AggFilterInput {
    field: string;
    values?: string[] | null;
    gte?: string | null;
    lte?: string | null;
    includeMissingFields?: boolean | null;
    zipcode?: string | null;
    radius?: string | null;
    lat?: number | null;
    long?: number | null;
  }
  
// ====================================================
// GraphQL query operation: SearchPageSearchQuery
// ====================================================

export interface SearchPageSearchQuery_search_studies {
  __typename: "ElasticStudy";
  averageRating: number;
  completionDate: any | null;
  nctId: string;
  overallStatus: string;
  startDate: any | null;
  briefTitle: string;
  reviewsCount: number | null;
  interventions: string[];
  facilityStates: string[];
  interventionsMeshTerms: string[];
  studyFirstSubmittedDate: string | null;
  resultsFirstSubmittedDate: string | null;
  dispositionFirstSubmittedDate: string | null;
  lastUpdateSubmittedDate: string | null;
  studyFirstSubmittedQcDate: string | null;
  studyFirstPostedDate: string | null;
  studyFirstPostedDateType: string | null;
  studyViewCount: number;
  resultsFirstSubmittedQcDate: string | null;
  resultsFirstPostedDate: string | null;
  resultsFirstPostedDateType: string | null;
  dispositionFirstSubmittedQcDate: string | null;
  dispositionFirstPostedDate: string | null;
  dispositionFirstPostedDateType: string | null;
  lastUpdateSubmittedQcDate: string | null;
  lastUpdatePostedDate: string | null;
  lastUpdatePostedDateType: string | null;
  studyType: string;
  acronym: string | null;
  baselinePopulation: string | null;
  officialTitle: string | null;
  lastKnownStatus: string | null;
  phase: string | null;
  enrollment: number | null;
  enrollmentType: string | null;
  source: string;
  numberOfArms: string | null;
  numberOfGroups: string | null;
  whyStopped: string | null;
  hasExpandedAccess: string | null;
  expandedAccessTypeTreatment: string | null;
  isFdaRegulatedDrug: string | null;
  isFdaRegulatedDevice: string | null;
  ipdTimeFrame: string | null;
  ipdAccessCriteria: string | null;
  ipdUrl: string | null;
  planToShareIpd: string | null;
  planToShareIpdDescription: string | null;
}

export interface SearchPageSearchQuery_search {
  __typename: "SearchResultSet";
  /**
   * A set of matching studies
   */
  studies: SearchPageSearchQuery_search_studies[];
}

export interface SearchPageSearchQuery {
  /**
   * Searches params by searchHash on server and `params` argument into it
   */
  search: SearchPageSearchQuery_search | null;
}

export interface SearchPageSearchQueryVariables {
  q: SearchQueryInput;
  page?: number | null;
  pageSize?: number | null;
  sorts?: SortInput[] | null;
  aggFilters?: AggFilterInput[] | null;
  crowdAggFilters?: AggFilterInput[] | null;
}
