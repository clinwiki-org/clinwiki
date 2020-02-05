import * as React from "react";
import styled from "styled-components";
import { trimPath } from "utils/helpers";
import { Switch, Route, match, Redirect } from "react-router";
import SiteViewsList from "./SiteViewsList/SiteViewsList";

interface SiteViewsPageProps {
  // siteViews: SiteViewFragment[];
  // onAddMutation: (e: { currentTarget: { name: string; value: any } }) => void;
  site: any;
  refresh: any;
}

interface SiteViewsPageState {
  form: {
    siteName: string | null;
    siteURL: string | null;
  };
}

const Container = styled.div`
  ul > li > a {
    color: white;

    &:hover {
      color: #333;
    }
  }
`;

class SiteViewsPage extends React.Component<
  SiteViewsPageProps,
  SiteViewsPageState
> {
  // renderTabs = () => {
  //   const path = trimPath(this.props.site.match.url);
  //   const sections = [
  //     { path: "/", value: "Site Views"},
  //     { path: "/"}
  //   ]

  //   const locationComponents = this.props.site.location.pathname.split("/");
  //   let activeKey = last(locationComponents);
  //   if (locationComponents[locationComponents.length - 2] === "study") {
  //     activeKey = "study";
  //   }
  //   activeKey = `/${activeKey}`;

  //   return (
  //     <StyledNav
  //       bsStyle="pills"
  //       activeKey={activeKey}
  //       onSelect={key => this.props.history.push(`${path}${key}`)}
  //     >
  //       {sections.map(section => (
  //         <NavItem key={`${section.path}`} eventKey={`${section.path}`}>
  //           {section.value}
  //         </NavItem>
  //       ))}
  //     </StyledNav>
  //   );
  // }

  render() {
    // const path = trimPath(this.props.site.match.path);
    return (
      <Container>
        <SiteViewsList site={this.props.site} refresh={this.props.refresh} />
        {/* {this.renderTabs()} */}
        {/* <Switch>
          <Route
            path={`${path}/`}
            exact
            render={() => <SiteViewsList site={this.props.site} />}
          />
          <Route
            path={`${path}/:id/edit`}
            render={routeProps => (
              <SiteViewsEditPage site={this.props.site} {...routeProps} />
            )}
          />
          <Redirect to={`${path}/`} />
        </Switch> */}
      </Container>
    );
  }
}

export default SiteViewsPage;
