/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: InterventionPageQuery
// ====================================================

export interface InterventionPageQuery_intervention_wikipediaArticle {
  __typename: "WikipediaArticle";
  /**
   * Id of the article on Wikipedia
   */
  id: number;
  /**
   * Artictle title
   */
  title: string;
  /**
   * Brief description
   */
  description: string;
  /**
   * Wikipedia url
   */
  url: string;
}

export interface InterventionPageQuery_intervention {
  __typename: "Intervention";
  /**
   * Intervention id
   */
  id: number;
  /**
   * Intervention description
   */
  description: string | null;
  /**
   * Intervention name
   */
  name: string | null;
  /**
   * Intervention type
   */
  type: string | null;
  /**
   * Wikipedia article searched by name. Use sparingly as it actually hits wikipedia api to get the data.
   */
  wikipediaArticle: InterventionPageQuery_intervention_wikipediaArticle | null;
}

export interface InterventionPageQuery {
  intervention: InterventionPageQuery_intervention | null;
}

export interface InterventionPageQueryVariables {
  id: number;
}
