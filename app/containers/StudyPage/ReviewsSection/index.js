/**
*
* ReviewsSection
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import ReactStars from 'react-stars';
import { ViewMarkdown } from 'components/TextEditor';
import { Grid, Table, Row, Col, Button, ButtonGroup, Label } from 'react-bootstrap';
// import styled from 'styled-components';


class ReviewsSection extends React.Component { // eslint-disable-line react/prefer-stateless-function

  getName(user) {
    if (user.first_name) {
      return `${user.first_name} ${user.last_name[0]}`;
    }
    return user.email;
  }

  render() {
    let body;
    if (!this.props.reviews || this.props.reviews.length === 0) {
      body = <h1>No Reviews!</h1>;
    } else {
      body = (
        <Col md={12}>
          <Table id="reviews-table" striped >
            <tbody>
              {this.props.reviews.map((review) => (
                <tr key={review.review.id} className="review-row">
                  <td>
                    <Row style={{ marginBottom: '10px' }}>
                      <Col md={8} className="name-of-user">
                        <b>{this.getName(review.user)}</b>
                        <br />
                      </Col>
                      <Col md={4} className="text-right">
                        <small>
                          {new Date(review.review.created_at).toLocaleDateString('en-US')}
                        </small>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={9}>
                        <div className="review-html">
                          <ViewMarkdown markdown={review.review.text} />
                        </div>
                      </Col>
                      <Col md={3} style={{ textAlign: 'right' }}>
                        {this.props.AuthHeader.user.loggedIn && review.user.id === this.props.AuthHeader.user.id ?
                          <ButtonGroup>
                            <Button
                              className="edit-review-button"
                              id={`edit-review-${review.review.id}`}
                              onClick={() => this.props.history.push(`/study/${this.props.nctId}/review/${review.review.id}/edit`)}
                            >
                              Edit
                            </Button>
                            <Button
                              className="delete-review-button"
                              id={`delete-review-${review.review.id}`}
                              onClick={() =>
                                this.props.deleteReview(review.review.nct_id, review.review.id)}
                            >
                              Delete
                            </Button>
                          </ButtonGroup>
                          : null }
                      </Col>
                    </Row>
                    <Row style={{ marginTop: '10px' }}>
                      {Object.keys(review.review.stars).map((field) => (
                        <div key={field}>
                          <Col md={2} className={`star-rating star-rating-${field.replace(' ', '-')}`}>
                            <ReactStars
                              count={5}
                              edit={false}
                              value={review.review.stars[field]}
                            />
                            <Label>{field}</Label>
                          </Col>
                        </div>
                      ))}
                    </Row>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      );
    }

    return (
      <Grid>
        <Row style={{ marginBottom: '10px' }}>
          <Col mdOffset={9} md={3}>
            <Button
              id="write-review"
              className="pull-right"
              onClick={(e) => {
                e.preventDefault();
                this.props.history.push(`/study/${this.props.nctId}/reviews/new`);
              }}
            >
              Write a Review
            </Button>
          </Col>
        </Row>
        <Row>
          {body}
        </Row>
      </Grid>
    );
  }
}

ReviewsSection.propTypes = {
  reviews: PropTypes.array,
  nctId: PropTypes.string,
  deleteReview: PropTypes.func,
  AuthHeader: PropTypes.object,
  history: ReactRouterPropTypes.history,
};

ReviewsSection.defaultProps = {
  reviews: [],
};

export default ReviewsSection;
