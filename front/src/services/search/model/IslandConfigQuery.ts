export interface IslandConfigQuery_facetConfigQuery {
    __typename: "IslandConfig";
    /**
     * the main facet config
     */
    id: number;
    config: string;
    islandType: string;  }
  
  export interface IslandConfigQuery {
    /**
     * All reaction Types
     */
    islandConfig: IslandConfigQuery_facetConfigQuery | null;
  }
  
  export interface IslandConfigFragment {
    __typename: "IslandConfig";
    id: number;
    config: string;
    islandType: string;
  }