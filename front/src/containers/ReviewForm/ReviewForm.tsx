import * as React from 'react';
import { Row, Col, FormControl, Panel } from 'react-bootstrap';
import { Mutation, MutationComponentOptions } from '@apollo/client/react/components';
import styled from 'styled-components';
import {
  keys,
  lensPath,
  set,
  dissocPath,
  equals,
  findIndex,
  propEq,
  over,
} from 'ramda';
import ReactStars from 'react-stars';
import * as FontAwesome from 'react-fontawesome';
import RichTextEditor, { EditorValue } from 'react-rte';
import { gql }  from '@apollo/client';
import ThemedButton from 'components/StyledComponents/index';
import {
  ReviewFormMutationVariables
} from 'types/ReviewFormMutation';
import { REVIEW_FORM_MUTATION, REVIEW_FRAGMENT } from '../../services/study/mutations'
import { STUDY_FRAGMENT } from '../../services/study/queries'
import { ReviewsPageFragment } from 'types/ReviewsPageFragment';
import { ReviewFormStudyFragment } from 'types/ReviewFormStudyFragment';
import { dataIdFromObject } from 'configureApollo';
import { ReviewFragment } from 'types/ReviewFragment';
import { connect } from 'react-redux';
import { upsertReviewFormMutation } from '../../services/study/actions';

interface ReviewFormProps {
  nctId: string;
  hideSaveButton?: boolean;
  hideMeta?: boolean;
  review?: ReviewsPageFragment;
  afterSave?: (review: ReviewFragment) => void;
  theme?: any;
  handleClose: ()=>void;
  upsertReviewFormMutation: any;
}

interface ReviewFormState {
  meta: {};
  newRating: string;
  content: EditorValue;
  prevReview: ReviewsPageFragment | null;
}

/*const FRAGMENT = gql`
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
`;*/

const defaultState = {
  meta: { 'Overall Rating': 0},
  newRating: '',
  content: RichTextEditor.createValueFromString(
    'Write your review here!',
    'markdown'
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

/*const ReviewFormMutationComponent = (
  props: MutationComponentOptions<
    REVIEW_FORM_MUTATION,
    ReviewFormMutationVariables
  >
) => Mutation(props);*/

class ReviewForm extends React.Component<ReviewFormProps, ReviewFormState> {
  state: ReviewFormState = defaultState;
  // Use this hook to trigger submit using ref from parent
  submitReview: () => void = () => {};
  static fragment = REVIEW_FRAGMENT;

  static getDerivedStateFromProps = (
    props: ReviewFormProps,
    state: ReviewFormState
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
          'markdown'
        ),
      };
    }

    return null;
  };

  handleRatingChange = (key: string, value: number) => {
    const lens = lensPath(['meta', key]);
    this.setState(set(lens, value, this.state) as ReviewFormState);
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
      // @ts-ignore
      this.setState({ ...set(lens, 0, this.state), newRating: '' });
    }
  };

  handleContentChange = (value: EditorValue) => {
    this.setState({ content: value });
  };

  handleSubmitReview = (
    upsertReview: (x: { variables: ReviewFormMutationVariables }) => void
  ) => () => {
    const id = (this.props.review && this.props.review.id) || undefined;
    console.log("handleSubmitReview called");
    upsertReview({
      variables: {
        id,
        meta: JSON.stringify(this.state.meta),
        content: this.state.content.toString('markdown'),
        nctId: this.props.nctId,
      },
    });
    this.setState(defaultState, ()=>this.props.handleClose());
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
                color2={this.props.theme.studyPage.reviewStarColor}
                half={false}
                value={this.state.meta[key]}
                onChange={value => this.handleRatingChange(key, value)}
              />
            </Col>
            <Col md={2} style={{ textAlign: 'right' }}>
              {key !== 'Overall Rating' && (
                <ThemedButton
                  bsSize="xsmall"
                  onClick={() => this.handleRatingDelete(key)}>
                  <FontAwesome name="minus" />
                </ThemedButton>
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

              <ThemedButton onClick={this.handleAddRating}>
                Add Rating
              </ThemedButton>
            </AddRatingWrapper>
          </Col>
        </Row>
      </div>
    );
  };

  render() {
    this.submitReview = this.handleSubmitReview(this.props.upsertReviewFormMutation);
    return (
      <div>
        {this.renderMeta()}
        <Panel>
          <Panel.Body>
            <RichTextEditor
              onChange={this.handleContentChange}
              value={this.state.content}
            />
            {this.props.hideSaveButton ? null : 
              (<>
                <ThemedButton
                  style={{ margin: 10 }}
                  onClick={this.handleSubmitReview(this.props.upsertReviewFormMutation)}>
                  Submit
                </ThemedButton>
                <ThemedButton
                  style={{ margin: 10 }}
                  onClick={()=>this.props.handleClose()}>
                  Cancel
                </ThemedButton>
              </>)}
          </Panel.Body>
        </Panel>
      </div>
    );
  }
}
export default ReviewForm;
