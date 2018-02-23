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
  margin: 0 0 0 auto;
  padding-right: 15px;
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
        value={Math.round(parseFloat(props.average_rating))}
      />
      <small><i>{props.reviews_length} Reviews</i></small>
    </ReviewSummaryWrapper>
  );
}

ReviewSummary.propTypes = {
  average_rating: PropTypes.string,
  reviews_length: PropTypes.number,
};

export default ReviewSummary;
