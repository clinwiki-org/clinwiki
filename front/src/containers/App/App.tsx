import * as React from 'react';
import styled from 'styled-components';
import { Switch, Route, withRouter, Redirect } from 'react-router-dom';
import NotFoundPage from 'containers/NotFoundPage';
import NotConfiguredPage from 'containers/NotConfiguredPage';
import { ProfilePage, EditProfilePage } from 'containers/ProfilePage';
import LandingPage from 'containers/LandingPage';
import AboutPage from 'containers/AboutPage';
import ReleaseNotes from 'containers/ReleaseNotes';
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
import EditAggIslandsPage from 'containers/EditAggIslandsPage';
import BulkEditPage from 'containers/BulkEditPage';
import withTheme from 'containers/ThemeProvider';
import MMTest from 'components/MailMerge/MMTestComponentWrapper'
import GenericPageWrapper from 'containers/GenericPage/GenericPageWrapper';
import HasuraGenericPage from 'containers/HasuraGenericPage/HasuraGenericPage.';
import Reindex from 'containers/Reindex';
import ProtectedRoute from 'components/ProtectedRoute/ProtectedRoute';

interface AppProps {
  history: History;
}

const AppWrapper = styled.div`
  background-color: #e7e7e7;
  min-height: 100vh;
  min-width: 100%;
`;

const ThemedAppWrapper = withTheme(AppWrapper);

class App extends React.PureComponent<AppProps> {
  render() {
    return (
      <ThemedAppWrapper>
        <CurrentUser>
          <span>
            <AuthHeader history={this.props.history} />
            <div className="main" style={{ paddingTop: '50px' }}>
              <Switch>
                <Route
                  exact
                  path="/"
                ><Redirect to="/search" /></Route>
                <Route exact path="/about" component={AboutPage} />
                <Route exact path="/version" component={ReleaseNotes} />
                <Route path="/search/" render={(props) => <GenericPageWrapper />} />
                <Route path="/study/:nctId"
                  render={(props) => <GenericPageWrapper arg={props.match.params.nctId} />}
                />
                <Route path="/condition/:conditionId"
                  render={(props) => <GenericPageWrapper arg={props.match.params.conditionId} />}
                />
                <Route path="/hasurastudy/:nctId"
                  render={(props) => <HasuraGenericPage arg={props.match.params.nctId} />}
                />
                <Route path="/p/:page/:arg?"
                  render={(props) => <GenericPageWrapper url={props.match.params.page} arg={props.match.params.arg} />}
                />
                <Route path="/p/:hasurapage/:arg?"
                  render={(props) => <HasuraGenericPage url={props.match.params.page} arg={props.match.params.arg} />}
                />
                <ProtectedRoute path="/aggIslands" component={EditAggIslandsPage} />
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
                <Route exact path="/mmtest" component={MMTest} />
                <Route exact path="/mmtest/:nctId" component={MMTest} />
                <ProtectedRoute path="/reindex" component={Reindex} />
                <Route component={NotFoundPage} />
              </Switch>
            </div>
          </span>
        </CurrentUser>
      </ThemedAppWrapper>
    );
  }
}

// @ts-ignore
export default withRouter(App);
