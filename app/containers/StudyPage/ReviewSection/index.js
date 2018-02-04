/**
 *
 * ReviewSection
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectReviewSection from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';

export class ReviewSection extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <Helmet>
          <title>ReviewSection</title>
          <meta name="description" content="Description of ReviewSection" />
        </Helmet>
        <FormattedMessage {...messages.header} />
      </div>
    );
  }
}

ReviewSection.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  reviewsection: makeSelectReviewSection(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'reviewSection', reducer });
const withSaga = injectSaga({ key: 'reviewSection', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(ReviewSection);
