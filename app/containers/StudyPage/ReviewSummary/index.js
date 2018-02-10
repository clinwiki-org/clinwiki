/**
*
* ReviewSummary
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import ReactStars from 'react-stars';
import { BeatLoader } from 'react-spinners';
import styled from 'styled-components';

// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

const ReviewSummaryWrapper = styled.div`
  margin: 0 auto;
  width: max-content;
  text-align: center;
`;

function ReviewSummary(props) {
  if (props.average_rating === null) {
    return (
      <BeatLoader color="#cccccc" />
    );
  }
  return (
    <ReviewSummaryWrapper>
      <ReactStars
        count={5}
        edit={false}
        value={props.average_rating}
      />
      <small><i>{props.reviews_length} Reviews</i></small>
    </ReviewSummaryWrapper>
  );
}

ReviewSummary.propTypes = {
  average_rating: PropTypes.number,
  reviews_length: PropTypes.number,
};

export default ReviewSummary;
