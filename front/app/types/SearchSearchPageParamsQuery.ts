/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SearchSearchPageParamsQuery
// ====================================================

export interface SearchSearchPageParamsQuery_searchParams_sorts {
  __typename: "Sort";
  /**
   * Column to sort by
   */
  id: string;
  /**
   * Sort in descending order if true
   */
  desc: boolean | null;
}

export interface SearchSearchPageParamsQuery_searchParams_aggFilters {
  __typename: "AggFilter";
  /**
   * The field we are filtering on
   */
  field: string;
  /**
   * The values we are filtering for that field
   */
  values: string[];
}

export interface SearchSearchPageParamsQuery_searchParams_crowdAggFilters {
  __typename: "AggFilter";
  /**
   * The field we are filtering on
   */
  field: string;
  /**
   * The values we are filtering for that field
   */
  values: string[];
}

export interface SearchSearchPageParamsQuery_searchParams {
  __typename: "SearchParams";
  /**
   * A Json version of the SearchQueryInput type
   */
  q: string | null;
  sorts: SearchSearchPageParamsQuery_searchParams_sorts[] | null;
  aggFilters: SearchSearchPageParamsQuery_searchParams_aggFilters[] | null;
  crowdAggFilters: SearchSearchPageParamsQuery_searchParams_crowdAggFilters[] | null;
  page: number | null;
  pageSize: number | null;
}

export interface SearchSearchPageParamsQuery {
  /**
   * Search params from hash
   */
  searchParams: SearchSearchPageParamsQuery_searchParams | null;
}

export interface SearchSearchPageParamsQueryVariables {
  hash?: string | null;
}
