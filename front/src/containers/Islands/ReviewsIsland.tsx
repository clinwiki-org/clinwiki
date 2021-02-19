import React, { useEffect } from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { RootState } from 'reducers';
import { DELETE_REVIEW_MUTATION } from '../../services/study/mutations';
import styled from 'styled-components';
import QUERY from 'queries/ReviewPageQuery';
//import { useCurrentUser } from 'containers/CurrentUser/CurrentUser';
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
} from '../../services/study/model/ReviewsPageFragment';
import { trimPath } from 'utils/helpers';
import ThemedButton from 'components/StyledComponents/index';
import { Row, Col, Table, Label } from 'react-bootstrap';
import ReactStars from 'react-stars';
import RichTextEditor, { EditorValue } from 'react-rte';
import { keys } from 'ramda';
//import { ReviewPageQuery } from 'types/ReviewPageQuery';
import { fetchReviewPage, deleteReviewMutation } from 'services/study/actions';
import { ReviewPageQuery } from '../../services/study/model/ReviewPageQuery';
import { upsertReviewFormMutation } from '../../services/study/actions';
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
  const dispatch = useDispatch();
  // TODO: This query should be pushed up as a fragment to the Page
/*  const { data: reviewData } =[] useQuery<ReviewPageQuery>(QUERY, {
    variables: { nctId },
  });*/
  const reviewData = useSelector( (state: RootState) => state.study.reviewPage);
  useEffect (() => {
//    console.log(props);
    dispatch (fetchReviewPage(nctId));
  },[dispatch,nctId]);
/*  const [deleteReviewMutation] = useMutation(DELETE_REVIEW_MUTATION, {
    refetchQueries: [{ query: QUERY, variables: { nctId } }],
  }); *deleteReviewMutation/
*/
  const deleteReviewMut = (action) => {
    console.log("deleteReviewMutation called");
    console.log(action);
    if (!action) return
    return dispatch(deleteReviewMutation(action.id, action.nctId))
  }

  //const user = useCurrentUser()?.data?.me;
  const user = useSelector( (state: RootState) => state.user.current);

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
  //const handleDeleteReview = (
  //  id: number
  //) => () => {
  //  dispatch(deleteReviewMutation(id));
  //};

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
                    onClick={ () => deleteReviewMut(
                      {id: review.id, nctId: nctId}
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
    console.log(reviews);
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
  console.log (reviewData)
  const upsertReview = (reviewData) => { 
    console.log(reviewData);
    return dispatch(upsertReviewFormMutation(reviewData.variables.id, reviewData.variables.nctId, reviewData.variables.meta, reviewData.variables.content)); 
  }  

  if (!reviewData || !nctId ) return <BeatLoader></BeatLoader>
  if (reviewData!.data) {
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
                upsertReviewFormMutation={upsertReview}
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
                upsertReviewFormMutation={upsertReview}
              />
            );
          }}
        />
        <Route render={() => renderReviews(reviewData!.data!.study!.reviews)} />
      </Switch>
    );
  }
  return <BeatLoader></BeatLoader>;
}
