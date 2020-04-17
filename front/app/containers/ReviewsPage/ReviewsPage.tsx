import * as React from 'react';
import { Switch, Route, match } from 'react-router-dom';
import { Button, Row, Col, Table, Label } from 'react-bootstrap';
import { History } from 'history';
import styled from 'styled-components';
import { gql } from 'apollo-boost';
import { Query, Mutation } from 'react-apollo';
import ReactStars from 'react-stars';
import StudySummary from 'components/StudySummary';
import ThemedButton from 'components/StyledComponents/index';
import ReviewForm from 'containers/ReviewForm';
import { trimPath } from 'utils/helpers';
import {
  ReviewPageQuery,
  ReviewPageQueryVariables,
} from 'types/ReviewPageQuery';
import {
  ReviewsPageFragment,
  ReviewsPageFragment_user,
} from 'types/ReviewsPageFragment';
import {
  ReviewsPageDeleteReviewMutation,
  ReviewsPageDeleteReviewMutationVariables,
} from 'types/ReviewsPageDeleteReviewMutation';
import { ReviewsPageStudyFragment } from 'types/ReviewsPageStudyFragment';
import RichTextEditor, { EditorValue } from 'react-rte-yt';
import EditReview from './EditReview';
import { reject, propEq, over, lensPath, keys } from 'ramda';
import { dataIdFromObject } from 'configureApollo';
import CurrentUser from 'containers/CurrentUser';
import { UserFragment } from 'types/UserFragment';
import { SiteStudyBasicGenericSectionFragment } from 'types/SiteStudyBasicGenericSectionFragment';
import { starColor } from 'utils/constants';
import withTheme from 'containers/ThemeProvider';

interface ReviewsPageProps {
  nctId: string;
  match: match<{ nctId: string }>;
  history: History;
  onLoaded?: () => void;
  isWorkflow?: boolean;
  nextLink?: string | null;
  metaData: SiteStudyBasicGenericSectionFragment;
  theme: any;
}

const FRAGMENT = gql`
  fragment ReviewsPageFragment on Review {
    id
    meta
    content
    createdAt
    user {
      id
      firstName
      lastName
      email
    }
  }
`;

const QUERY = gql`
  query ReviewPageQuery($nctId: String!) {
    study(nctId: $nctId) {
      ...StudySummaryFragment
      reviews {
        ...ReviewsPageFragment
      }
      nctId
    }
    me {
      id
    }
  }

  ${StudySummary.fragment}
  ${FRAGMENT}
`;

const STUDY_FRAGMENT = gql`
  fragment ReviewsPageStudyFragment on Study {
    nctId
    reviews {
      ...ReviewsPageFragment
    }
  }

  ${FRAGMENT}
`;

const DELETE_REVIEW_MUTATION = gql`
  mutation ReviewsPageDeleteReviewMutation($id: Int!) {
    deleteReview(input: { id: $id }) {
      success
      errors
    }
  }
`;

const RatingsWrapper = styled.div`
  display: flex;
`;

const RatingWrapper = styled.div`
  margin: 10px;
`;

const WriteReviewButton = styled(ThemedButton)`
  margin-bottom: 10px;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

class QueryComponent extends Query<ReviewPageQuery, ReviewPageQueryVariables> {}
class DeleteReviewMutationComponent extends Mutation<
  ReviewsPageDeleteReviewMutation,
  ReviewsPageDeleteReviewMutationVariables
> {}

class ReviewsPage extends React.PureComponent<ReviewsPageProps> {
  static fragment = FRAGMENT;

  getName = (user: ReviewsPageFragment_user) => {
    if (user.firstName) {
      return `${user.firstName} ${user.lastName && user.lastName[0]}`;
    }
    return user.email;
  };

  handleWriteReview = () => {
    this.props.history.push(`${trimPath(this.props.match.url)}/new`);
  };

  handleEditReview = (id: number) => {
    this.props.history.push(`${trimPath(this.props.match.url)}/${id}/edit`);
  };

  handleDeleteReview = (
    deleteReview: (x: {
      variables: ReviewsPageDeleteReviewMutationVariables;
    }) => void,
    id: number
  ) => () => {
    deleteReview({ variables: { id } });
  };

  renderRating = (key: string, value: string) => {
    const { theme } = this.props;
    return (
      <RatingWrapper key={key}>
        <ReactStars
          edit={false}
          color2={theme.studyPage.reviewStarColor}
          count={5}
          half={false}
          value={value}
        />
        <Label>{key}</Label>
      </RatingWrapper>
    );
  };

  renderReview = (user: UserFragment | null) => (
    review: ReviewsPageFragment
  ) => {
    let meta = {};
    try {
      meta = JSON.parse(review.meta);
    } catch (e) {
      console.error(`Error parsing meta ${review.meta}`, e);
    }
    const authorized = user && user.email === review.user.email;
    return (
      <tr key={review.id}>
        <td>
          <Row style={{ marginBottom: '10px', padding: '10px' }}>
            <Col md={10}>
              <b>{this.getName(review.user)}</b>
              <br />
            </Col>
            <Col md={2} className="text-right">
              <small>
                {new Date(review.createdAt).toLocaleDateString('en-US')}
              </small>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <RichTextEditor
                readOnly
                value={EditorValue.createFromString(review.content, 'markdown')}
              />
            </Col>
            <Col md={4} />
            {authorized && (
              <Col md={2}>
                <ButtonsWrapper>
                  <ThemedButton
                    style={{ marginRight: 10 }}
                    onClick={() => this.handleEditReview(review.id)}>
                    Edit
                  </ThemedButton>
                  <DeleteReviewMutationComponent
                    mutation={DELETE_REVIEW_MUTATION}
                    update={cache => {
                      const id = dataIdFromObject({
                        id: this.props.match.params.nctId,
                        __typename: 'Study',
                      });

                      const study = cache.readFragment<
                        ReviewsPageStudyFragment
                        // tslint:disable-next-line
                      >({
                        id,
                        fragment: STUDY_FRAGMENT,
                        fragmentName: 'ReviewsPageStudyFragment',
                      });
                      const reviewsLens = lensPath(['reviews']);
                      const newStudy = over(
                        reviewsLens,
                        reject(propEq('id', review.id)),
                        study
                      );

                      cache.writeFragment({
                        id,
                        fragment: STUDY_FRAGMENT,
                        fragmentName: 'ReviewsPageStudyFragment',
                        data: newStudy,
                      });
                    }}>
                    {deleteReview => (
                      <ThemedButton
                        onClick={this.handleDeleteReview(
                          deleteReview,
                          review.id
                        )}>
                        Delete
                      </ThemedButton>
                    )}
                  </DeleteReviewMutationComponent>
                </ButtonsWrapper>
              </Col>
            )}
          </Row>
          <RatingsWrapper>
            {keys(meta).map(key => this.renderRating(key, meta[key]))}
          </RatingsWrapper>
        </td>
      </tr>
    );
  };

  renderReviews = (reviews: ReviewsPageFragment[]) => {
    return (
      <CurrentUser>
        {user => (
          <>
            {user && (
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <WriteReviewButton onClick={this.handleWriteReview}>
                  Write a review
                </WriteReviewButton>
              </div>
            )}
            <Table striped bordered>
              <tbody>{reviews.map(this.renderReview(user))}</tbody>
            </Table>
          </>
        )}
      </CurrentUser>
    );
  };

  render() {
    return (
      <QueryComponent query={QUERY} variables={{ nctId: this.props.nctId }}>
        {({ data, loading, error }) => {
          if (loading || error || !data || !data.study || !data.study.reviews) {
            return null;
          }

          this.props.onLoaded && this.props.onLoaded();

          return (
            <Switch>
              <Route
                path={`${this.props.match.path}/new`}
                render={props => {
                  this.props.onLoaded && this.props.onLoaded();
                  return <ReviewForm nctId={this.props.nctId} />;
                }}
              />
              <Route
                path={`${this.props.match.path}/:id/edit`}
                render={props => {
                  return (
                    <EditReview {...props} onLoaded={this.props.onLoaded} />
                  );
                }}
              />
              <Route render={() => this.renderReviews(data!.study!.reviews)} />
            </Switch>
          );
        }}
      </QueryComponent>
    );
  }
}

export default withTheme(ReviewsPage);
