import * as React from "react";
import styled from "styled-components";
import { Switch, Route, withRouter } from "react-router-dom";
import NotFoundPage from "containers/NotFoundPage";
import NotConfiguredPage from "containers/NotConfiguredPage";
import SearchPage from "containers/SearchPage";
import LandingPage from "containers/LandingPage";
import AboutPage from "containers/AboutPage";
import ReleaseNotes from "containers/ReleaseNotes";
import StudyPage from "containers/StudyPage";
import InterventionPage from "containers/InterventionPage";
import {
  SignInPage,
  SignUpPage,
  ResetPasswordPage,
  EditProfilePage
} from "containers/LoginPage";
import AuthHeader from "components/AuthHeader";
import { History } from "history";
import CurrentUser from "containers/CurrentUser";
import SitesPage from "containers/SitesPage";
import SitesNewPage from "containers/SitesNewPage";
import SitesEditPage from "containers/SitesEditPage";
import EditWorkflowsPage from "containers/EditWorkflowsPage";

interface AppProps {
  history: History;
}

const AppWrapper = styled.div`
  background-color: #4d5863;
  min-height: 100vh;
  min-width: 100%;
`;
const MainWrapper = styled.div``;

class App extends React.PureComponent<AppProps> {
  render() {
    return (
      <AppWrapper>
        <CurrentUser>
          {user => <AuthHeader user={user} history={this.props.history} />}
        </CurrentUser>
        <MainWrapper
          className="main container-fluid"
          style={{ paddingTop: "50px" }}
        >
          <Switch>
            <Route exact path="/" component={LandingPage} />
            <Route exact path="/about" component={AboutPage} />
            <Route exact path="/version" component={ReleaseNotes} />
            <Route path="/search/:siteviewUrl/:searchId" component={SearchPage} />
            <Route path="/search/:siteviewUrl" component={SearchPage} />
            <Route
              path="/study/:nctId/review/:reviewId/edit"
              component={StudyPage}
            />
            <Route path="/study/:nctId" component={StudyPage} />
            <Route path="/intervention/:id" component={InterventionPage} />
            <Route path="/profile" component={EditProfilePage} />
            <Route path="/workflows" component={EditWorkflowsPage} />
            <Route path="/sites/:id/edit" component={SitesEditPage} />
            <Route path="/sites/new" component={SitesNewPage} />
            <Route path="/sites" component={SitesPage} />
            <Route path="/reset_password" component={ResetPasswordPage} />
            <Route path="/sign_in" component={SignInPage} />
            <Route path="/sign_up" component={SignUpPage} />
            <Route path="/not-configured" component={NotConfiguredPage} />
            <Route component={NotFoundPage} />
          </Switch>
        </MainWrapper>
      </AppWrapper>
    );
  }
}

// @ts-ignore
export default withRouter(App);
