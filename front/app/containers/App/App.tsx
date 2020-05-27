import * as React from 'react';
import styled from 'styled-components';
import { Switch, Route, withRouter, Redirect } from 'react-router-dom';
import NotFoundPage from 'containers/NotFoundPage';
import NotConfiguredPage from 'containers/NotConfiguredPage';
import SearchPage from 'containers/SearchPage';
import { ProfilePage, EditProfilePage } from 'containers/ProfilePage';
import LandingPage from 'containers/LandingPage';
import AboutPage from 'containers/AboutPage';
import ReleaseNotes from 'containers/ReleaseNotes';
import StudyPage from 'containers/StudyPage';
import SearchStudyPage from 'containers/SearchStudyPage';
import InterventionPage from 'containers/InterventionPage';
import {
  SignInPage,
  SignUpPage,
  ResetPasswordPage,
  UpdatePassword,
} from 'containers/LoginPage';
import AuthHeader from 'components/AuthHeader';
import { History } from 'history';
import CurrentUser from 'containers/CurrentUser';
import SitesPage from 'containers/SitesPage';
import SitesNewPage from 'containers/SitesNewPage';
import SitesEditPage from 'containers/SitesEditPage';
import EditWorkflowsPage from 'containers/EditWorkflowsPage';
import BulkEditPage from 'containers/BulkEditPage';
import withTheme from 'containers/ThemeProvider';

interface AppProps {
  history: History;
}

const AppWrapper = styled.div`
  background-color: ${props => props.theme.backgroundColor};
  min-height: 100vh;
  min-width: 100%;
`;

const ThemedAppWrapper = withTheme(AppWrapper);

const MainWrapper = styled.div``;

class App extends React.PureComponent<AppProps> {
  render() {
    return (
      <ThemedAppWrapper>
        <CurrentUser>
          {(user, refetch) =>
            <span>
              <AuthHeader user={user} history={this.props.history} />
              <MainWrapper className="main" style={{ paddingTop: '50px' }}>
                <Switch>
                  <Route
                    exact
                    path="/"
                    component={
                      this.props.history.location.search ? SearchPage : LandingPage
                    }
                  />
                  <Route exact path="/about" component={AboutPage} />
                  <Route exact path="/version" component={ReleaseNotes} />
                  <Route path="/search/" component={SearchPage} />
                  <Route path="/search/:siteviewUrl" component={SearchPage} />
                  <Route
                    path="/study/:nctId/review/:reviewId/edit"
                    component={StudyPage}
                  />
                  <Route path="/study/:nctId"
                    render={(props) => <SearchStudyPage {...props} user={user} refetch={refetch} />}
                  />
                  <Route path="/intervention/:id" component={InterventionPage} />
                  <Route exact path="/profile" component={EditProfilePage} />
                  <Route path="/profile/:id/" component={ProfilePage} />
                  <Route path="/workflows" component={EditWorkflowsPage} />
                  <Route path={`/bulk`} component={BulkEditPage} />
                  <Route path="/sites/:id/edit" component={SitesEditPage} />
                  <Route path="/sites/new" component={SitesNewPage} />
                  <Route path="/sites" component={SitesPage} />
                  <Route path="/reset_password" component={ResetPasswordPage} />
                  <Route path="/sign_in" component={SignInPage} />
                  <Route path="/sign_up" component={SignUpPage} />
                  <Route path="/not-configured" component={NotConfiguredPage} />
                  <Route path="/update_password" component={UpdatePassword} />
                  <Route component={NotFoundPage} />
                </Switch>
              </MainWrapper>
            </span>
          }
        </CurrentUser>
      </ThemedAppWrapper>
    );
  }
}

// @ts-ignore
export default withRouter(App);
