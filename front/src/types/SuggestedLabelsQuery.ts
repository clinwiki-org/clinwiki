/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SuggestedLabelsQuery
// ====================================================

export interface SuggestedLabelsQuery_crowdAggFacets_aggs_buckets {
  __typename: "AggBucket";
  key: string;
  keyAsString: string | null;
  docCount: number;
}

export interface SuggestedLabelsQuery_crowdAggFacets_aggs {
  __typename: "Agg";
  name: string;
  buckets: SuggestedLabelsQuery_crowdAggFacets_aggs_buckets[];
}

export interface SuggestedLabelsQuery_crowdAggFacets {
  __typename: "SearchResultSet";
  aggs: SuggestedLabelsQuery_crowdAggFacets_aggs[] | null;
}

export interface SuggestedLabelsQuery_study_wikiPage {
  __typename: "WikiPage";
  nctId: string;
  /**
   * Json key value pairs of meta information
   */
  meta: string;
}

export interface SuggestedLabelsQuery_study {
  __typename: "Study";
  nctId: string;
  wikiPage: SuggestedLabelsQuery_study_wikiPage | null;
}

export interface SuggestedLabelsQuery {
  crowdAggFacets: SuggestedLabelsQuery_crowdAggFacets;
  study: SuggestedLabelsQuery_study | null;
}

export interface SuggestedLabelsQueryVariables {
  nctId: string;
  crowdBucketsWanted?: string[] | null;
}
