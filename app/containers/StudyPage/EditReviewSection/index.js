/**
*
* EditReviewSection
*
*/
import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col } from 'react-bootstrap';
import LoadingPane from 'components/LoadingPane';
import ReviewForm from 'components/ReviewForm';

class EditReviewSection extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    if (!_.get(this.props, 'review.text')) {
      return <LoadingPane />;
    }
    return (
      <Grid>
        <Row>
          <Col md={12}>
            <ReviewForm
              nctId={this.props.nctId}
              loggedIn={this.props.loggedIn}
              submitReview={(nctId, review, stars) => this.props.updateReview(nctId, review, stars, this.props.review.id)}
              stars={this.props.review.stars}
              review={this.props.review.text}
              reviewId={this.props.review.id}
            />
          </Col>
        </Row>
      </Grid>
    );
  }
}

EditReviewSection.propTypes = {
  nctId: PropTypes.string,
  updateReview: PropTypes.func.isRequired,
  loggedIn: PropTypes.bool,
  review: PropTypes.object,
};

export default EditReviewSection;
