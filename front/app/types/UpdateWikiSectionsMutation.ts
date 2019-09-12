/* tslint:disable */
// This file was automatically generated and should not be edited.

import { UpdateWikiSectionsInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateWikiSectionsMutation
// ====================================================

export interface UpdateWikiSectionsMutation_updateWikiSections_wikiPage {
  __typename: "WikiPage";
  nctId: string;
  content: string;
}

export interface UpdateWikiSectionsMutation_updateWikiSections {
  __typename: "UpdateWikiSectionsPayload";
  wikiPage: UpdateWikiSectionsMutation_updateWikiSections_wikiPage | null;
  errors: string[] | null;
}

export interface UpdateWikiSectionsMutation {
  updateWikiSections: UpdateWikiSectionsMutation_updateWikiSections | null;
}

export interface UpdateWikiSectionsMutationVariables {
  input: UpdateWikiSectionsInput;
}
