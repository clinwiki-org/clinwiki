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
import { Switch, Route } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { compose, bindActionCreators } from 'redux';
import { Nav, NavItem, Row, Col } from 'react-bootstrap';
import 'react-toggle/style.css';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectAuthHeader from 'containers/AuthHeader/selectors';
import LoadingPane from 'components/LoadingPane';
import ReviewSummary from './ReviewSummary';
import makeSelectStudyPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import * as actions from './actions';
import WikiSection from './WikiSection/Loadable';
import CrowdSection from './CrowdSection/Loadable';
import TagsSection from './TagsSection/Loadable';
import NewReviewSection from './NewReviewSection/Loadable';
import EditReviewSection from './EditReviewSection/Loadable';
import ReviewsSection from './ReviewsSection/Loadable';
import GenericStudySection from './GenericStudySection';
import SummaryInfo from './SummaryInfo/Loadable';
import WikiToggle from './WikiToggle';


const StudyWrapper = styled.div`
  display: flex;
  align-items: stretch;

  .table-striped>tbody>tr:nth-of-type(odd) {
    background-color: #eee;
  }

  #study-sidebar {
    padding-top: 0px;
    padding-left: 0px;
    li {
      text-align: right;
    }
  }
  #study-main {
    padding-left: 0px;
  }
`;

export class StudyPage extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.onNavItemSelect = this.onNavItemSelect.bind(this);
  }

  componentDidMount() {
    this.props.actions.studyViewed(this.props.match.params.nctId);
    if (this.props.match.params.reviewId) {
      this.props.actions.getReviewAction(this.props.match.params.reviewId);
    }
  }

  onNavItemSelect(key) {
    this.props.history.push(
      `/study/${this.props.match.params.nctId}/${this.defaultSections[key]}`
    );
  }

  defaultSections = {
    Wiki: '',
    Crowd: 'crowd',
    Reviews: 'reviews',
    Descriptive: 'descriptive',
    Administrative: 'administrative',
    Recruitment: 'recruitment',
    Tracking: 'tracking',
    Sites: 'sites',
    Tags: 'tags',
  };

  genericRoute(route) {
    return (
      <Route
        path={`/study/:nctId/${this.defaultSections[route]}`}
        render={() => (<GenericStudySection data={this.props.StudyPage[this.defaultSections[route]]} />)}
      />
    );
  }

  tagsRoute() {
    return (
      <Route
        path="/study/:nctId/tags"
        render={() => (
          <TagsSection
            StudyPage={this.props.StudyPage}
            submitTag={this.props.actions.submitTag}
            removeTag={this.props.actions.removeTag}
            loggedIn={_.get(this.props.AuthHeader, 'user.loggedIn')}
          />)}
      />
    );
  }

  reviewsRoute() {
    return (
      <Route
        path="/study/:nctId/reviews"
        render={() => (
          <ReviewsSection
            history={this.props.history}
            reviews={_.get(this.props.StudyPage, 'reviews')}
            nctId={_.get(this.props.StudyPage, 'study.nct_id')}
            deleteReview={this.props.actions.deleteReview}
            AuthHeader={this.props.AuthHeader}
          />)}
      />
    );
  }

  newReviewRoute() {
    return (
      <Route
        path="/study/:nctId/reviews/new"
        render={() => (
          <NewReviewSection
            nctId={_.get(this.props.StudyPage, 'study.nct_id')}
            submitReview={this.props.actions.submitReview}
            loggedIn={_.get(this.props.AuthHeader, 'user.loggedIn')}
          />)}
      />
    );
  }

  editReviewRoute() {
    return (
      <Route
        path="/study/:nctId/review/:reviewId/edit"
        exact
        render={() => (
          <EditReviewSection
            nctId={_.get(this.props.StudyPage, 'study.nct_id')}
            updateReview={this.props.actions.updateReview}
            loggedIn={_.get(this.props.AuthHeader, 'user.loggedIn')}
            review={_.get(this.props.StudyPage, 'review')}
          />)}
      />
    );
  }

  render() {
    const navItems = Object.keys(this.defaultSections).map((x) => (
      <NavItem eventKey={x} key={x}>
        {x}
      </NavItem>
    ));

    let inner;
    if (_.get(this.props.StudyPage, 'study.title')) {
      inner = (
        <div id="study-main">
          <SummaryInfo study={_.get(this.props, 'StudyPage.study')} />
          <Switch>
            <Route exact path="/study/:nctId" component={WikiSection} />
            {this.editReviewRoute()}
            {this.newReviewRoute()}
            {this.reviewsRoute()}
            <Route path="/study/:nctId/crowd" component={CrowdSection} />
            {this.genericRoute('Descriptive')}
            {this.genericRoute('Administrative')}
            {this.genericRoute('Recruitment')}
            {this.genericRoute('Tracking')}
            {this.genericRoute('Sites')}
            {this.tagsRoute()}
          </Switch>
        </div>
      );
    } else {
      inner = (<LoadingPane />);
    }

    return (
      <StudyWrapper>
        <Row>
          <Col md={2} id="study-sidebar">
            <ReviewSummary
              average_rating={_.get(this.props, 'StudyPage.study.average_rating')}
              reviews_length={_.get(this.props, 'StudyPage.study.reviews_length')}
            />
            <WikiToggle
              wikiOverride={_.get(this.props, 'StudyPage.wikiOverride')}
              nctId={_.get(this.props, 'StudyPage.study.nct_id')}
              onWikiOverride={this.props.actions.onWikiOverrideAction}
            />
            <Nav bsStyle="pills" stacked activeKey={0} onSelect={this.onNavItemSelect}>
              {navItems}
            </Nav>
          </Col>
          <Col md={10} id="study-main">
            {inner}
          </Col>
        </Row>
      </StudyWrapper>
    );
  }
}

StudyPage.propTypes = {
  actions: PropTypes.object,
  match: ReactRouterPropTypes.match,
  history: ReactRouterPropTypes.history,
  StudyPage: PropTypes.object,
  AuthHeader: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  StudyPage: makeSelectStudyPage(),
  AuthHeader: makeSelectAuthHeader(),
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
