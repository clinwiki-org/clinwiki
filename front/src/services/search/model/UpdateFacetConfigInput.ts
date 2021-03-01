/**
 * Possible set of operations of facet config
 */
export enum FacetConfigOperation {
    SET = "SET",
  }


/**
 * An atomic mutation of facet Config 
 */
export interface Input {
      jsonObj: string;
      clientMutationId: string | null;
}
export interface UpdateFacetConfigInput {
    // jsonObj: string;
    // clientMutationId?: string;
    input: Input
  }