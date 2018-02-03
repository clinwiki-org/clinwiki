/**
 *
 * StudyPage
 *
 */

import React from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose, bindActionCreators } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectStudyPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import * as actions from './actions';

export class StudyPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        hi
        {/* <Helmet>
          <title>StudyPage</title>
          <meta name="description" content="Description of StudyPage" />
        </Helmet> */}
      </div>
    );
  }
}

StudyPage.propTypes = {
  actions: PropTypes.object,
  match: ReactRouterPropTypes.match,
  studypage: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  StudyPage: makeSelectStudyPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);
const withReducer = injectReducer({ key: 'StudyPage', reducer });
const withSaga = injectSaga({ key: 'StudyPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(StudyPage);
