/**
*
* NewReviewSection
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col } from 'react-bootstrap';
import ReviewForm from 'components/ReviewForm';

class NewReviewSection extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <Grid>
        <Row>
          <Col md={12}>
            <ReviewForm
              nctId={this.props.nctId}
              loggedIn={this.props.loggedIn}
              submitReview={this.props.submitReview}
              submitText={this.props.submitText}
            />
          </Col>
        </Row>
      </Grid>
    );
  }
}

NewReviewSection.propTypes = {
  nctId: PropTypes.string,
  submitReview: PropTypes.func.isRequired,
  loggedIn: PropTypes.bool,
  submitText: PropTypes.string,
};

export default NewReviewSection;
