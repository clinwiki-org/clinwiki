/**
 *
 * StudyPage
 *
 */

import _ from 'lodash';
import React from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Route } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { compose, bindActionCreators } from 'redux';
import { Nav, NavItem, PageHeader } from 'react-bootstrap';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectStudyPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import * as actions from './actions';
import WikiSection from './WikiSection/Loadable';
import LoadingPane from './LoadingPane';

const StudyWrapper = styled.div`
  display: flex;
  align-items: stretch;

  #study-sidebar {
    padding-top: 100px;
    min-width: 200px;
    max-width: 200px;
  }
`;

export class StudyPage extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.onNavItemSelect = this.onNavItemSelect.bind(this);
  }

  componentDidMount() {
    this.props.actions.studyViewed(this.props.match.params.nctId);
  }

  onNavItemSelect(key) {
    this.props.actions.navItemSelected(key);
  }

  defaultSections = [
    'Wiki',
    'Crowd',
    'Descriptive',
    'Administrative',
    'Recruitment',
    'Tracking',
    'Sites',
  ];

  render() {
    const navItems = this.defaultSections.map((x, i) => (
      <NavItem eventKey={i} key={x}>
        {x}
      </NavItem>
    ));

    let inner;
    if (_.get(this.props.StudyPage, 'study.title')) {
      inner = (
        <div id="study-main">
          <PageHeader>
            {this.props.StudyPage.study.title}
          </PageHeader>
          <Route path="/" component={WikiSection} />
        </div>
      );
    } else {
      inner = (<LoadingPane />);
    }

    return (
      <StudyWrapper>
        <div id="study-sidebar">
          <Nav bsStyle="pills" stacked activeKey={0} onSelect={this.onNavItemSelect}>
            {navItems}
          </Nav>
        </div>
        {inner}
      </StudyWrapper>
    );
  }
}

StudyPage.propTypes = {
  actions: PropTypes.object,
  match: ReactRouterPropTypes.match,
  StudyPage: PropTypes.object,
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
