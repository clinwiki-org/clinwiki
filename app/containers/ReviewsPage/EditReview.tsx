import * as React from 'react';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import {
  EditReviewQuery,
  EditReviewQueryVariables,
} from 'types/EditReviewQuery';
import { match } from 'react-router-dom';
import { find, propEq } from 'ramda';
import ReviewForm from 'containers/ReviewForm';
import { ReviewsPageFragment } from 'types/ReviewsPageFragment';
import { History } from 'history';
import StudySummary from 'components/StudySummary';

interface EditReviewProps {
  match: match<{ nctId: string; id?: string }>;
  history: History;
  onLoaded?: () => void;
  isWorkflow?: boolean;
  nextLink?: string | null;
}

const QUERY = gql`
  query EditReviewQuery($nctId: String!) {
    study(nctId: $nctId) {
      ...StudySummaryFragment
      reviews {
        ...ReviewFragment
      }
      nctId
    }
  }

  ${ReviewForm.fragment}
  ${StudySummary.fragment}
`;

class QueryComponent extends Query<EditReviewQuery, EditReviewQueryVariables> {}

class EditReview extends React.PureComponent<EditReviewProps> {
  render() {
    return (
      <QueryComponent
        query={QUERY}
        variables={{ nctId: this.props.match.params.nctId }}
      >
        {({ data, loading, error }) => {
          if (loading || error || !data || !data.study || !data.study.reviews) {
            return null;
          }
          if (!this.props.match.params.id) {
            return null;
          }
          const id = parseInt(this.props.match.params.id, 10);
          const review = find(
            propEq('id', id),
            data.study.reviews,
          ) as ReviewsPageFragment;
          if (!review) return null;

          this.props.onLoaded && this.props.onLoaded();

          return (
            <ReviewForm
              review={review}
              history={this.props.history}
              match={this.props.match}
            />
          );
        }}
      </QueryComponent>
    );
  }
}

export default EditReview;
