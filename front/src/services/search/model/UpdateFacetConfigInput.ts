/**
 * Possible set of operations of facet config
 */
export enum FacetConfigOperation {
    SET = "SET",
  }


/**
 * An atomic mutation of facet Config 
 */
export interface UpdateFacetConfigInput {
    operation: FacetConfigOperation;
    payload: string;
  }