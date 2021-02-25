export interface FacetConfigQuery_facetConfigQuery {
    __typename: "ReactionKind";
    /**
     * the main facet config
     */
    mainConfig: string;
  }
  
  export interface FacetConfigQuery {
    /**
     * All reaction Types
     */
    facetConfig: FacetConfigQuery_facetConfigQuery | null;
  }
  
  export interface FacetConfigFragment {
    __typename: "FacetConfig";
    id: number;
    mainConfig: string;
  }