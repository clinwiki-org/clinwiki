/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SearchQueryInput, SortInput, AggFilterInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: SearchPageSearchQuery
// ====================================================

export interface SearchPageSearchQuery_crowdAggs_aggs_buckets {
  __typename: "AggBucket";
  key: string;
  keyAsString: string | null;
  docCount: number;
}

export interface SearchPageSearchQuery_crowdAggs_aggs {
  __typename: "Agg";
  buckets: SearchPageSearchQuery_crowdAggs_aggs_buckets[];
}

export interface SearchPageSearchQuery_crowdAggs {
  __typename: "SearchResultSet";
  aggs: SearchPageSearchQuery_crowdAggs_aggs[] | null;
}

export interface SearchPageSearchQuery_search_aggs_buckets {
  __typename: "AggBucket";
  key: string;
  docCount: number;
}

export interface SearchPageSearchQuery_search_aggs {
  __typename: "Agg";
  name: string;
  buckets: SearchPageSearchQuery_search_aggs_buckets[];
}

export interface SearchPageSearchQuery_search_studies {
  __typename: "Study";
  averageRating: number;
  completionDate: any | null;
  nctId: string;
  overallStatus: string;
  startDate: any | null;
  briefTitle: string;
  reviewsCount: number;
  nlmDownloadDateDescription: string | null;
  studyFirstSubmittedDate: string | null;
  resultsFirstSubmittedDate: string | null;
  dispositionFirstSubmittedDate: string | null;
  lastUpdateSubmittedDate: string | null;
  studyFirstSubmittedQcDate: string | null;
  studyFirstPostedDate: string | null;
  studyFirstPostedDateType: string | null;
  resultsFirstSubmittedQcDate: string | null;
  resultsFirstPostedDate: string | null;
  resultsFirstPostedDateType: string | null;
  dispositionFirstSubmittedQcDate: string | null;
  dispositionFirstPostedDate: string | null;
  dispositionFirstPostedDateType: string | null;
  lastUpdateSubmittedQcDate: string | null;
  lastUpdatePostedDate: string | null;
  lastUpdatePostedDateType: string | null;
  startMonthYear: string | null;
  startDateType: string | null;
  verificationMonthYear: string | null;
  verificationDate: any | null;
  completionMonthYear: string | null;
  completionDateType: string | null;
  primaryCompletionMonthYear: string | null;
  primaryCompletionDateType: string | null;
  primaryCompletionDate: any | null;
  targetDuration: string | null;
  studyType: string;
  acronym: string | null;
  baselinePopulation: string | null;
  officialTitle: string | null;
  lastKnownStatus: string | null;
  phase: string | null;
  enrollment: number | null;
  enrollmentType: string | null;
  source: string;
  limitationsAndCaveats: string | null;
  numberOfArms: string | null;
  numberOfGroups: string | null;
  whyStopped: string | null;
  hasExpandedAccess: string | null;
  expandedAccessTypeIndividual: string | null;
  expandedAccessTypeIntermediate: string | null;
  expandedAccessTypeTreatment: string | null;
  hasDmc: string | null;
  isFdaRegulatedDrug: string | null;
  isFdaRegulatedDevice: string | null;
  isUnapprovedDevice: string | null;
  isPpsd: string | null;
  isUsExport: string | null;
  biospecRetention: string | null;
  biospecDescription: string | null;
  ipdTimeFrame: string | null;
  ipdAccessCriteria: string | null;
  ipdUrl: string | null;
  planToShareIpd: string | null;
  planToShareIpdDescription: string | null;
}

export interface SearchPageSearchQuery_search {
  __typename: "SearchResultSet";
  /**
   * Total results
   */
  recordsTotal: number | null;
  aggs: SearchPageSearchQuery_search_aggs[] | null;
  /**
   * A set of matching studies
   */
  studies: SearchPageSearchQuery_search_studies[];
}

export interface SearchPageSearchQuery {
  crowdAggs: SearchPageSearchQuery_crowdAggs;
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
