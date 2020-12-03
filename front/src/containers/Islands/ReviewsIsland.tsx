import React from 'react';
import {
  DELETE_REVIEW_MUTATION,
  DeleteMutationFn,
} from 'mutations/ReviewsPageDeleteReviewMutation';

import styled from 'styled-components';
import QUERY from 'queries/ReviewPageQuery';
import { useQuery, useMutation } from 'react-apollo';
import { useCurrentUser } from 'containers/CurrentUser/CurrentUser';
import useUrlParams, { queryStringAll } from 'utils/UrlParamsProvider';
import { BeatLoader } from 'react-spinners';
import { Switch, Route } from 'react-router-dom';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import ReviewForm from 'containers/ReviewForm';
import { useTheme } from 'containers/ThemeProvider/ThemeProvider';
import EditReview from '../ReviewsPage/EditReview';
import {
  ReviewsPageFragment,
  ReviewsPageFragment_user,
} from 'types/ReviewsPageFragment';
import { trimPath } from 'utils/helpers';
import ThemedButton from 'components/StyledComponents/index';
import { Row, Col, Table, Label } from 'react-bootstrap';
import ReactStars from 'react-stars';
import { ReviewPageQuery } from 'types/ReviewPageQuery';
import RichTextEditor, { EditorValue } from 'react-rte';
import { keys } from 'ramda';
interface Props {
  nctId: string;
}

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

export default function ReviewsIsland(props: Props) {
  const { nctId } = props;
  const history = useHistory();
  const location = useLocation();
  const match = useRouteMatch();
  const theme = useTheme();
  const params = useUrlParams();
  // TODO: This query should be pushed up as a fragment to the Page
  const { data: reviewData } = useQuery<ReviewPageQuery>(QUERY, {
    variables: { nctId },
  });
  console.log(reviewData);
  const [deleteReviewMutation] = useMutation(DELETE_REVIEW_MUTATION, {
    refetchQueries: [{ query: QUERY, variables: { nctId } }],
  });

  const user = useCurrentUser()?.data?.me;

  const WriteReviewButton = styled(ThemedButton)`
    margin-bottom: 10px;
  `;

  const handleWriteReview = () => {
    history.push(`${trimPath(match.url)}/new${queryStringAll(params)}`);
  };
  const handleEditReview = (id: number) => {
    history.push(`${trimPath(match.url)}/${id}/edit${queryStringAll(params)}`);
  };
  const handleCloseReview = () => {
    history.push(`${trimPath(match.url)}${queryStringAll(params)}`);
  };
  const handleDeleteReview = (
    deleteReview: DeleteMutationFn,
    id: number
  ) => () => {
    deleteReview({ variables: { id } });
  };

  const getName = (user: ReviewsPageFragment_user) => {
    if (user.firstName) {
      return `${user.firstName} ${user.lastName && user.lastName[0]}`;
    }
    return user.email;
  };
  const renderRating = (key: string, value: string) => {
    if (theme) {
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
    }
  };
  const renderReview = () => (review: ReviewsPageFragment) => {
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
              <b>{getName(review.user)}</b>
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
                    onClick={() => handleEditReview(review.id)}>
                    Edit
                  </ThemedButton>

                  <ThemedButton
                    onClick={handleDeleteReview(
                      deleteReviewMutation,
                      review.id
                    )}>
                    Delete
                  </ThemedButton>
                </ButtonsWrapper>
              </Col>
            )}
          </Row>
          <RatingsWrapper>
            {keys(meta).map(key => renderRating(key, meta[key]))}
          </RatingsWrapper>
        </td>
      </tr>
    );
  };

  const renderReviews = (reviews: ReviewsPageFragment[]) => {
    return (
      <>
        <div style={{ display: 'flex' }}>
          <WriteReviewButton onClick={() => handleWriteReview()}>
            Write a review
          </WriteReviewButton>
        </div>
        <Table striped bordered>
          <tbody>{reviews.map(renderReview())}</tbody>
        </Table>
      </>
    );
  };

  if (reviewData) {
    return (
      <Switch>
        <Route
          path={`${match.path}/new`}
          render={() => {
            return (
              <ReviewForm
                theme={theme}
                nctId={nctId}
                handleClose={handleCloseReview}
              />
            );
          }}
        />
        <Route
          path={`${match.path}/:id/edit`}
          render={props => {
            let newProps = { ...props, nctId: nctId };
            return (
              <EditReview
                {...newProps}
                onLoaded={() => console.log('Loaded')}
              />
            );
          }}
        />
        <Route render={() => renderReviews(reviewData!.study!.reviews)} />
      </Switch>
    );
  }
  return <BeatLoader></BeatLoader>;
}
