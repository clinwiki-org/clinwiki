import { gql } from 'apollo-boost';
import { WikiPageEditFragment } from 'components/Edits';
import { MutationComponentOptions, Mutation, MutationFunction } from 'react-apollo';
import { CrowdPageDeleteWikiLabelMutation, CrowdPageDeleteWikiLabelMutationVariables } from 'types/CrowdPageDeleteWikiLabelMutation';

export const FRAGMENT = gql`
  fragment CrowdPageFragment on WikiPage {
    nctId
    meta
  }
`;

export const DELETE_LABEL_MUTATION = gql`
  mutation CrowdPageDeleteWikiLabelMutation($nctId: String!, $key: String!) {
    deleteWikiLabel(input: { nctId: $nctId, key: $key }) {
      wikiPage {
        ...CrowdPageFragment
        edits {
          ...WikiPageEditFragment
        }
      }
      errors
    }
  }

  ${FRAGMENT}
  ${WikiPageEditFragment}
`;

export const DeleteMutationComponent = (
  props: MutationComponentOptions<
    CrowdPageDeleteWikiLabelMutation,
    CrowdPageDeleteWikiLabelMutationVariables
  >
) => Mutation(props);

export type DeleteMutationFn = MutationFunction<
  CrowdPageDeleteWikiLabelMutation,
  CrowdPageDeleteWikiLabelMutationVariables
>;