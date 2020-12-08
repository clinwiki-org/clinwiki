
import { gql }  from '@apollo/client';
import { WikiPageEditFragment } from 'components/Edits';
import {
  CrowdPageUpsertWikiLabelMutation,
  CrowdPageUpsertWikiLabelMutationVariables,
} from 'types/CrowdPageUpsertWikiLabelMutation';
import { Mutation, MutationComponentOptions } from '@apollo/client/react/components';
import { MutationFunction } from '@apollo/client';

const FRAGMENT = gql`
  fragment CrowdPageFragment on WikiPage {
    nctId
    meta
  }
`;

export const UPSERT_LABEL_MUTATION = gql`
  mutation CrowdPageUpsertWikiLabelMutation(
    $nctId: String!
    $key: String!
    $value: String!
  ) {
    upsertWikiLabel(input: { nctId: $nctId, key: $key, value: $value }) {
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

export const UpsertMutationComponent = (
  props: MutationComponentOptions<
    CrowdPageUpsertWikiLabelMutation,
    CrowdPageUpsertWikiLabelMutationVariables
  >
) => Mutation(props);

export type UpsertMutationFn = MutationFunction<
  CrowdPageUpsertWikiLabelMutation,
  CrowdPageUpsertWikiLabelMutationVariables
>;
