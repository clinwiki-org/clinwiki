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
import AuthHeader from 'containers/AuthHeader/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import SearchPage from 'containers/SearchPage/Loadable';
import ProfilePage from 'containers/ProfilePage/Loadable';
import saga from './saga';

const AppWrapper = styled.div``;
const MainWrapper = styled.div `
  margin: 0 15px;
`;

function App() {
  return (
    <AppWrapper>
      <AuthHeader />
      <MainWrapper>
        <Switch>
          <Route exact path="/" component={SearchPage} />
          <Route exact path="/search" component={SearchPage} />
          <Route path="/search/:searchQuery" component={SearchPage} />
          <Route path="/profile" component={ProfilePage} />
          <Route component={NotFoundPage} />
        </Switch>
      </MainWrapper>
    </AppWrapper>
  );
}

const withSaga = injectSaga({ key: 'App', saga });

export default compose(
  withSaga,
)(App);
