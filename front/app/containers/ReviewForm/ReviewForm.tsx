import * as React from 'react';
import { Row, Col, Button, FormControl, Panel } from 'react-bootstrap';
import { match } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import styled from 'styled-components';
import {
  keys,
  lensPath,
  set,
  dissocPath,
  pipe,
  split,
  dropLast,
  join,
  equals,
  findIndex,
  propEq,
  over,
} from 'ramda';
import ReactStars from 'react-stars';
import * as FontAwesome from 'react-fontawesome';
import RichTextEditor, { EditorValue } from 'react-rte-yt';
import { gql } from 'apollo-boost';
import { History } from 'history';

import {
  ReviewFormMutation,
  ReviewFormMutationVariables,
} from 'types/ReviewFormMutation';
import { ReviewsPageFragment } from 'types/ReviewsPageFragment';
import { ReviewFormStudyFragment } from 'types/ReviewFormStudyFragment';

import { trimPath } from 'utils/helpers';
import { dataIdFromObject } from 'configureApollo';
import { ReviewFragment } from 'types/ReviewFragment';
import { starColor } from 'utils/constants';
interface ReviewFormProps {
  nctId: string;
  hideSaveButton?: boolean;
  hideMeta?: boolean;
  review?: ReviewsPageFragment;
  afterSave?: (review: ReviewFragment) => void;
}

interface ReviewFormState {
  meta: {};
  newRating: string;
  content: EditorValue;
  prevReview: ReviewsPageFragment | null;
}

const FRAGMENT = gql`
  fragment ReviewFragment on Review {
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

const MUTATION = gql`
  mutation ReviewFormMutation(
    $id: Int
    $nctId: String!
    $meta: String!
    $content: String!
  ) {
    upsertReview(
      input: { id: $id, nctId: $nctId, meta: $meta, content: $content }
    ) {
      review {
        ...ReviewFragment
      }
      errors
    }
  }

  ${FRAGMENT}
`;

const STUDY_FRAGMENT = gql`
  fragment ReviewFormStudyFragment on Study {
    nctId
    reviews {
      ...ReviewFragment
    }
  }

  ${FRAGMENT}
`;

const defaultState = {
  meta: { 'Overall Rating': 0, Safety: 0, Efficacy: 0 },
  newRating: '',
  content: RichTextEditor.createValueFromString(
    'Write your review here!',
    'markdown',
  ),
  prevReview: null,
};

const MetaRow = styled(Row)`
  padding-bottom: 10px;
`;

const AddRatingWrapper = styled.div`
  display: flex;
  padding-bottom: 10px;
  button {
    margin-left: 10px;
  }
`;

class ReviewFormMutationComponent extends Mutation<
  ReviewFormMutation,
  ReviewFormMutationVariables
> {}

class ReviewForm extends React.Component<ReviewFormProps, ReviewFormState> {
  state: ReviewFormState = defaultState;
  // Use this hook to trigger submit using ref from parent
  submitReview: () => void = () => {};
  static fragment = FRAGMENT;

  static getDerivedStateFromProps = (
    props: ReviewFormProps,
    state: ReviewFormState,
  ): ReviewFormState | null => {
    if (props.review != null && !equals(props.review, state.prevReview)) {
      let meta = defaultState.meta;
      try {
        meta = JSON.parse(props.review.meta);
      } catch (e) {
        console.error(`Error parsing review meta: ${meta}`, e);
      }
      return {
        ...state,
        meta,
        prevReview: props.review,
        content: RichTextEditor.createValueFromString(
          props.review.content,
          'markdown',
        ),
      };
    }

    return null;
  };

  handleRatingChange = (key: string, value: number) => {
    const lens = lensPath(['meta', key]);
    this.setState(set(lens, value, this.state));
  };
  handleRatingDelete = (key: string) => {
    const newState = dissocPath(['meta', key], this.state) as ReviewFormState;
    this.setState(newState);
  };
  handleAddRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newRating: e.currentTarget.value });
  };

  handleAddRating = () => {
    if (this.state.newRating.replace(/\s/g, '').length) {
      const lens = lensPath(['meta', this.state.newRating]);
      this.setState({ ...set(lens, 0, this.state), newRating: '' });
    }
  };

  handleContentChange = (value: EditorValue) => {
    this.setState({ content: value });
  };

  handleSubmitReview = (
    upsertReview: (x: { variables: ReviewFormMutationVariables }) => void,
  ) => () => {
    const id = (this.props.review && this.props.review.id) || undefined;
    upsertReview({
      variables: {
        id,
        meta: JSON.stringify(this.state.meta),
        content: this.state.content.toString('markdown'),
        nctId: this.props.nctId,
      },
    });
    this.setState(defaultState);
  };

  renderMeta = () => {
    if (this.props.hideMeta) return null;

    return (
      <div>
        {keys(this.state.meta).map(key => (
          <MetaRow key={key}>
            <Col md={4}>
              <b>{key}</b>
            </Col>
            <Col md={6}>
              <ReactStars
                count={5}
                color2={starColor}
                half={false}
                value={this.state.meta[key]}
                onChange={value => this.handleRatingChange(key, value)}
              />
            </Col>
            <Col md={2} style={{ textAlign: 'right' }}>
              {key !== 'Overall Rating' && (
                <Button
                  bsSize="xsmall"
                  onClick={() => this.handleRatingDelete(key)}
                >
                  <FontAwesome name="minus" />
                </Button>
              )}
            </Col>
          </MetaRow>
        ))}
        <Row>
          <Col md={8} />
          <Col md={4}>
            <AddRatingWrapper>
              <FormControl
                type="text"
                placeholder="Your Rating"
                value={this.state.newRating}
                onChange={this.handleAddRatingChange}
              />

              <Button onClick={this.handleAddRating}>Add Rating</Button>
            </AddRatingWrapper>
          </Col>
        </Row>
      </div>
    );
  };

  render() {
    return (
      <div>
        {this.renderMeta()}
        <Panel>
          <Panel.Body>
            <RichTextEditor
              onChange={this.handleContentChange}
              value={this.state.content}
            />
            <ReviewFormMutationComponent
              mutation={MUTATION}
              update={(cache, { data }) => {
                const review =
                  data && data.upsertReview && data.upsertReview.review;
                if (!review) return;
                const id = dataIdFromObject({
                  id: this.props.nctId,
                  __typename: 'Study',
                });
                const study = cache.readFragment<ReviewFormStudyFragment>({
                  id,
                  fragment: STUDY_FRAGMENT,
                  fragmentName: 'ReviewFormStudyFragment',
                });
                const reviews = (study && study.reviews) || [];

                const idx = findIndex(propEq('id', review.id), reviews);
                let newStudy;
                if (idx === -1) {
                  const reviewsLens = lensPath(['reviews']);
                  newStudy = over(
                    reviewsLens,
                    reviews => [review, ...(reviews as any)],
                    study,
                  );
                } else {
                  const reviewLens = lensPath(['reviews', idx]);
                  newStudy = set(reviewLens, review, study);
                }

                cache.writeFragment({
                  id,
                  fragment: STUDY_FRAGMENT,
                  fragmentName: 'ReviewFormStudyFragment',
                  data: newStudy,
                });

                this.props.afterSave && this.props.afterSave(review);
              }}
            >
              {upsertReview => {
                this.submitReview = this.handleSubmitReview(upsertReview);
                return (
                  !this.props.hideSaveButton && (
                    <Button
                      style={{ marginTop: 10 }}
                      onClick={this.handleSubmitReview(upsertReview)}
                    >
                      Submit
                    </Button>
                  )
                );
              }}
            </ReviewFormMutationComponent>
          </Panel.Body>
        </Panel>
      </div>
    );
  }
}

export default ReviewForm;
