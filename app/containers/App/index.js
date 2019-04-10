/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React from 'react';
import { compose } from 'redux';
import styled from 'styled-components';
import { Switch, Route } from 'react-router-dom';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import AuthHeader from 'containers/AuthHeader/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import SearchPage from 'containers/SearchPage';
import ProfilePage from 'containers/ProfilePage/Loadable';
import StudyPage from 'containers/StudyPage';
import LoginSignupPage from 'containers/LoginSignupPage/Loadable';
// eslint-disable-next-line
import InterventionPage from 'containers/InterventionPage';
// eslint-disable-next-line
import FeedPage from 'containers/FeedPage';
// eslint-disable-next-line
import FeedsPage from 'containers/FeedsPage';
import saga from './saga';
import reducer from './reducer';

const AppWrapper = styled.div``;
const MainWrapper = styled.div``;

function App() {
  return (
    <AppWrapper>
      <AuthHeader />
      <MainWrapper>
        <Switch>
          <Route exact path="/" component={SearchPage} />
          <Route exact path="/feeds" component={FeedsPage} />
          <Route exact path="/feeds/:feedId" component={FeedPage} />
          <Route path="/search/:searchId" component={SearchPage} />
          <Route path="/search" component={SearchPage} />
          <Route path="/feeds/:feedId/study/:studyId" component={FeedPage} />
          <Route path="/profile" component={ProfilePage} />
          <Route
            path="/study/:nctId/review/:reviewId/edit"
            component={StudyPage}
          />
          <Route path="/study/:nctId" component={StudyPage} />
          <Route path="/intervention/:id" component={InterventionPage} />
          <Route path="/reset-password" component={LoginSignupPage} />
          <Route path="/login-signup" component={LoginSignupPage} />
          <Route path="/logout" component={LoginSignupPage} />
          <Route component={NotFoundPage} />
        </Switch>
      </MainWrapper>
    </AppWrapper>
  );
}

const withSaga = injectSaga({ key: 'App', saga });
const withReducer = injectReducer({ key: 'authHeader', reducer });

const app = compose(
  withSaga,
  withReducer,
)(App);

export default app;
