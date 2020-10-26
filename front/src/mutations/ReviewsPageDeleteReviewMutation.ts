import { gql }  from '@apollo/client';
import { WikiPageEditFragment } from 'components/Edits';
import { MutationComponentOptions, Mutation } from '@apollo/client/react/components';
import { MutationFunction } from '@apollo/client';
import { ReviewsPageDeleteReviewMutation, ReviewsPageDeleteReviewMutationVariables } from 'types/ReviewsPageDeleteReviewMutation';


export const DELETE_REVIEW_MUTATION = gql`
  mutation ReviewsPageDeleteReviewMutation($id: Int!) {
    deleteReview(input: { id: $id }) {
      success
      errors
    }
  }
`;

export const DeleteMutationComponent = (
  props: MutationComponentOptions<
    ReviewsPageDeleteReviewMutation,
    ReviewsPageDeleteReviewMutationVariables
  >
) => Mutation(props);

export type DeleteMutationFn = MutationFunction<
  ReviewsPageDeleteReviewMutation,
  ReviewsPageDeleteReviewMutationVariables
>;