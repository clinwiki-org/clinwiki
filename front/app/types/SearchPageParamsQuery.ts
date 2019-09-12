/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SearchPageParamsQuery
// ====================================================

export interface SearchPageParamsQuery_searchParams_sorts {
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

export interface SearchPageParamsQuery_searchParams_aggFilters {
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

export interface SearchPageParamsQuery_searchParams_crowdAggFilters {
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

export interface SearchPageParamsQuery_searchParams {
  __typename: "SearchParams";
  /**
   * A Json version of the SearchQueryInput type
   */
  q: string | null;
  sorts: SearchPageParamsQuery_searchParams_sorts[] | null;
  aggFilters: SearchPageParamsQuery_searchParams_aggFilters[] | null;
  crowdAggFilters: SearchPageParamsQuery_searchParams_crowdAggFilters[] | null;
  page: number | null;
  pageSize: number | null;
}

export interface SearchPageParamsQuery {
  /**
   * Search params from hash
   */
  searchParams: SearchPageParamsQuery_searchParams | null;
}

export interface SearchPageParamsQueryVariables {
  hash?: string | null;
}
