import React from 'react';
import PropTypes from 'prop-types';
import RichTextEditor from 'react-rte';
import FontAwesome from 'react-fontawesome';
import ReactStars from 'react-stars';
import styled from 'styled-components';
import { fromJS } from 'immutable';
import _ from 'lodash';
import { Button, Row, Col, FormControl } from 'react-bootstrap';

const CREATE_REVIEW = 'Write your review here!';

export const DEFAULT_STARS = { 'Overall Rating': 0, Safety: 0, Efficacy: 0 };

const DEFAULT_STATE = {
  starFields: {},
  starFieldsEditable: {},
  addingStars: {},
  addingRows: 0,
  changed: false,
  value: null,
};

const ReviewFormWrapper = styled.div`
  .rating-row { margin-bottom: 10px; }
  .adding-stars { padding-top: 5px; }
`;

class ReviewForm extends React.Component {
  constructor(props) {
    super(props);
    this.onStarChange = this.onStarChange.bind(this);
    this.onReviewChange = this.onReviewChange.bind(this);
    this.submitReview = this.submitReview.bind(this);
    this.addRating = this.addRating.bind(this);
    this.removeRating = this.removeRating.bind(this);
    this.removeAddedRating = this.removeAddedRating.bind(this);
    this.onStarFieldChange = this.onStarFieldChange.bind(this);
    this.stars = Object.assign(DEFAULT_STARS, this.props.stars);
    this.review = this.props.review;
  }

  state = Object.assign({}, DEFAULT_STATE);

  componentWillMount() {
    this.setState({
      value: RichTextEditor.createValueFromString(this.review || CREATE_REVIEW, 'markdown'),
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.review !== nextProps.review) {
      this.state.value = RichTextEditor.createValueFromString(nextProps.review, 'markdown');
      this.forceUpdate();
    }
    if (this.props.stars !== nextProps.stars) {
      this.stars = Object.assign(DEFAULT_STARS, nextProps.stars);
    }
  }

  componentWillUnmount() {
    this.stars = { 'Overall Rating': 0, Safety: 0, Efficacy: 0 };
    this.state = {
      starFields: {},
      starFieldsEditable: {},
      addingStars: {},
      addingRows: 0,
      changed: false,
      value: null,
    };
    // this is a dumb workaround but it fixing this state bug would
    // require a lot more work with sagas than the star bug in a new review would merit
    Object.keys(DEFAULT_STARS).forEach((star) => {
      delete DEFAULT_STARS[star];
    });
    DEFAULT_STARS['Overall Rating'] = 0;
    DEFAULT_STARS.Safety = 0;
    DEFAULT_STARS.Efficacy = 0;
  }

  onStarFieldChange(i, e) {
    e.persist();
    this.state.starFields[i] = e.target.value;
    this.state.starFieldsEditable[i] = this.state.starFields[i] !== '';
    this.forceUpdate();
  }

  onStarChange(field, e) {
    this.stars[field] = e;
  }

  onAddingStarChange(i, e) {
    this.state.addingStars[i] = e;
  }

  onReviewChange(value) {
    this.setState({
      value,
      changed: true,
    });
  }

  submitReview(e) {
    e.persist();
    e.preventDefault();
    const stars = Object.keys(this.state.addingStars).reduce((starAcc, i) =>
      starAcc.set(this.state.starFields[i], this.state.addingStars[i]), fromJS(this.stars)).toJS();
    this.props.submitReview(this.props.nctId, this.state.value.toString('markdown'), stars, this.props.reviewId);
    this.state = Object.assign(DEFAULT_STATE,
      { value: RichTextEditor.createValueFromString(CREATE_REVIEW, 'markdown') });

    // this is a dumb workaround but it fixing this state bug would
    // require a lot more work with sagas than the star bug in a new review would merit
    Object.keys(DEFAULT_STARS).forEach((star) => {
      delete DEFAULT_STARS[star];
    });
    DEFAULT_STARS['Overall Rating'] = 0;
    DEFAULT_STARS.Safety = 0;
    DEFAULT_STARS.Efficacy = 0;
    this.stars = DEFAULT_STARS;

    this.forceUpdate();
  }

  addRating() {
    this.state.addingRows += 1;
    this.state.starFieldsEditable[this.state.addingRows - 1] = false;
    this.forceUpdate();
  }

  removeRating(field) {
    delete this.stars[field];
    this.forceUpdate();
  }

  removeAddedRating(i) {
    delete this.state.starFields[i];
    delete this.state.addingStars[i];

    this.state.addingRows -= 1;
    this.forceUpdate();
  }

  render() {
    if (!this.props.loggedIn) {
      return <h1>Not logged in!</h1>;
    }
    if (this.props.reviewIsLoading) {
      return null;
    }
    return (
      <ReviewFormWrapper>
        <Row id="study-tabs">
          <Col md={12}>
            {Object.keys(this.props.stars).map((field, i) => (
              <Row className="rating-row" key={field}>
                <Col md={4}>
                  <b>{field}</b>
                </Col>
                <Col md={6}>
                  <ReactStars
                    count={5}
                    half={false}  // can't do half-star ratings with current db schema
                    value={this.props.stars[field]}
                    onChange={(e) => this.onStarChange(field, e)}
                  />
                </Col>
                <Col md={2} style={{ textAlign: 'right' }}>
                  { field === 'Overall Rating' ? null :
                  <Button bsSize="xsmall" onClick={() => this.removeRating(field)}>
                    <FontAwesome name="minus" />
                  </Button>
                  }
                  { this.state.addingRows === 0 && (i === Object.keys(this.props.stars).length - 1) ?
                    <Button bsSize="xsmall" style={{ marginLeft: '5px' }} onClick={this.addRating}>
                      <FontAwesome name="plus" />
                    </Button>
                    : null
                  }
                </Col>
              </Row>
            ))}
            {_.range(this.state.addingRows).map((i) => (
              <Row className="rating-row" key={i}>
                <Col md={4}>
                  <FormControl
                    type="text"
                    placeholder="Your Rating"
                    onChange={(e) => this.onStarFieldChange(i, e)}
                  />
                </Col>
                <Col md={6} className="adding-stars">
                  <ReactStars
                    count={5}
                    half={false}  // can't do half-star ratings with current db schema
                    value={this.state.addingStars[i]}
                    onChange={(e) => this.onAddingStarChange(i, e)}
                  />
                </Col>
                <Col md={2} style={{ textAlign: 'right' }}>
                  { (i === this.state.addingRows - 1) ?
                    <div>
                      <Button bsSize="xsmall" onClick={() => this.removeAddedRating(i)}>
                        <FontAwesome name="minus" />
                      </Button>
                      <Button style={{ marginLeft: '5px' }} bsSize="xsmall" onClick={this.addRating}>
                        <FontAwesome name="plus" />
                      </Button>
                    </div>
                    : null
                  }
                </Col>
              </Row>
            ))}
            <Row>
              <Col md={12}>
                <RichTextEditor
                  onChange={this.onReviewChange}
                  value={this.state.value}
                />
              </Col>
            </Row>
            <Row style={{ marginTop: '10px' }}>
              <Col md={12} className="text-right">
                <Button type="submit" onClick={this.submitReview}>
                  Submit
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </ReviewFormWrapper>
    );
  }
}

ReviewForm.propTypes = {
  nctId: PropTypes.string,
  submitReview: PropTypes.func.isRequired,
  loggedIn: PropTypes.bool,
  stars: PropTypes.any,
  review: PropTypes.string,
  reviewId: PropTypes.number,
  reviewIsLoading: PropTypes.bool,
};

ReviewForm.defaultProps = {
  stars: Object.assign({}, DEFAULT_STARS),
  review: '',
};

export default ReviewForm;
