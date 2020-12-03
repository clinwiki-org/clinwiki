import { gql } from 'apollo-boost';
import { WikiPageEditFragment } from 'components/Edits';
import { MutationComponentOptions, Mutation, MutationFunction } from 'react-apollo';
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