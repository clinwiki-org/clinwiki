/**
 * Autogenerated input type of CreateSite
 */
export interface CreateSiteInput {
    name: string;
    subdomain: string;
    skipLanding?: boolean | null;
    hideDonation?: boolean | null;
    themes?: string | null;
    reactionsConfig?: string | null;
    userRank?: string | null;
    editorEmails?: string[] | null;
    clientMutationId?: string | null;
  }


  /**
 * Autogenerated input type of UpdateSite
 */
export interface UpdateSiteInput {
  id: number;
  name?: string | null;
  themes?: string | null;
  reactionsConfig?: string | null;
  userRank?: string | null;
  skipLanding?: boolean | null;
  hideDonation?: boolean | null;
  subdomain?: string | null;
  editorEmails?: string[] | null;
  clientMutationId?: string | null;
}

/**
 * Autogenerated input type of DeleteSiteView
 */
export interface DeleteSiteViewInput {
  id: number;
  clientMutationId?: string | null;
}

