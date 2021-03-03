/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SitesPageQuery
// ====================================================

export interface SitesPageQuery_me_ownSites {
    __typename: "Site";
    id: number;
    name: string;
    subdomain: string;
  }
  
  export interface SitesPageQuery_me_editorSites {
    __typename: "Site";
    id: number;
    name: string;
    subdomain: string;
  }
  
  export interface SitesPageQuery_me {
    __typename: "User";
    /**
     * Id
     */
    id: number;
    ownSites: SitesPageQuery_me_ownSites[];
    editorSites: SitesPageQuery_me_editorSites[];
  }
  
  export interface SitesPageQuery {
    /**
     * Current logged in user
     */
    me: SitesPageQuery_me | null;
  }
  