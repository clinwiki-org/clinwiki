/**
 *
 * StudyPage
 *
 */

import _ from 'lodash';
import React from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import { pathOr, indexOf } from 'ramda';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Switch, Route, Link } from 'react-router-dom';
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
// eslint-disable-next-line
import InterventionsSection from './InterventionsSection';
import WikiToggle from './WikiToggle';

const StudyWrapper = styled.div`
  display: flex;
  align-items: stretch;

  .table-striped>tbody>tr:nth-of-type(odd) {
    background-color: #eee;
  }

  .navlinks {
    margin-bottom: 10px;
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
    const pathComponents = location.pathname.split('/');
    let studyIndex = indexOf('study', pathComponents);
    if (studyIndex === -1) {
      studyIndex = indexOf('studies', pathComponents);
    }

    if (studyIndex === pathComponents.length - 3) {
      pathComponents[pathComponents.length - 1] = this.defaultSections[key];
    } else if (studyIndex === pathComponents.length - 4) {
      pathComponents.pop();
      pathComponents.pop();
      pathComponents.push(this.defaultSections[key]);
    } else {
      pathComponents.push(this.defaultSections[key]);
    }

    this.props.history.push(pathComponents.join('/'));
  }

  handleSubmitReview = (...data) => {
    this.props.actions.submitReview(...data);
    if (this.props.isFeed && this.props.nextLink) {
      this.props.history.push(this.props.nextLink);
    }
  }

  defaultSections = {
    Wiki: '',
    Crowd: 'crowd',
    Reviews: 'reviews',
    Descriptive: 'descriptive',
    Administrative: 'administrative',
    Recruitment: 'recruitment',
    Interventions: 'interventions',
    Tracking: 'tracking',
    Sites: 'sites',
    Tags: 'tags',
  };

  genericRoute(route) {
    return (
      <Route
        path={`${this.props.match.url}/${this.defaultSections[route]}`}
        render={() => (<GenericStudySection data={this.props.StudyPage[this.defaultSections[route]]} />)}
      />
    );
  }

  tagsRoute() {
    return (
      <Route
        path={`${this.props.match.url}/tags`}
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

  interventionsRoute = () => (
    <Route
      path={`${this.props.match.url}/interventions`}
      render={() => (
        <InterventionsSection
          history={this.props.history}
          nctId={pathOr(null, ['StudyPage', 'study', 'nct_id'], this.props)}
          loggedIn={pathOr(false, ['AuthHeader', 'user', 'loggedIn'], this.props)}
        />
      )}
    />
  );

  reviewsRoute() {
    return (
      <Route
        path={`${this.props.match.url}/reviews`}
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
        path={`${this.props.match.url}/reviews/new`}
        render={() => (
          <NewReviewSection
            nctId={_.get(this.props.StudyPage, 'study.nct_id')}
            submitReview={this.handleSubmitReview}
            loggedIn={_.get(this.props.AuthHeader, 'user.loggedIn')}
            submitText={this.props.isFeed ? 'Submit and next' : 'Submit'}
          />)}
      />
    );
  }

  editReviewRoute() {
    return (
      <Route
        path={`${this.props.match.url}/review/:reviewId/edit`}
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

  renderNavigationLink = (link: string | null | undefined, name: string) => {
    if (!link) return null;

    return <Link to={link}>{name}</Link>;
  }

  render() {
    const navItems = Object.keys(this.defaultSections).map((x) => (
      <NavItem eventKey={x} key={x}>
        {x}
      </NavItem>
    ));

    let inner;
    if (_.get(this.props.StudyPage, 'study.brief_title')) {
      inner = (
        <div id="study-main">
          <div className="container navlinks">
            <Row>
              <Col md={12}>
                {this.renderNavigationLink(this.props.backLink, 'Back to Search results')}
                &nbsp;
                &nbsp;
                {this.renderNavigationLink(this.props.prevLink, '<< Prev')}
                &nbsp;
                &nbsp;
                {this.renderNavigationLink(this.props.nextLink, 'Next >>')}
              </Col>
            </Row>
          </div>
          <SummaryInfo study={_.get(this.props, 'StudyPage.study')} />
          <Switch>
            <Route exact path={`${this.props.match.url}/`} component={WikiSection} />
            {this.editReviewRoute()}
            {this.newReviewRoute()}
            {this.reviewsRoute()}
            <Route path={`${this.props.match.url}/crowd`} component={CrowdSection} />
            {this.genericRoute('Descriptive')}
            {this.genericRoute('Administrative')}
            {this.genericRoute('Recruitment')}
            {this.interventionsRoute()}
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
  isFeed: PropTypes.bool,
  match: ReactRouterPropTypes.match,
  history: ReactRouterPropTypes.history,
  prevLink: PropTypes.string,
  nextLink: PropTypes.string,
  backLink: PropTypes.string,
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
