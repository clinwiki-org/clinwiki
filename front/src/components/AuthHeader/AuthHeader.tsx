import * as React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { History } from 'history';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import withTheme from 'containers/ThemeProvider/ThemeProvider';
import logo from 'images/clinwiki-501.png';
import UserProfileHeaderButton from './UserProfileHeaderButton';
import { UserFragment } from 'types/UserFragment';
import { gql } from "apollo-boost";
import {
  Query,
  QueryComponentOptions,
} from 'react-apollo';
import Error from "../Error";
import { AdminViewsProviderQuery, AdminViewsProviderQueryVariables } from 'types/AdminViewsProviderQuery';

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const ADMIN_SITE_VIEW_FRAGMENT = gql`
    fragment AdminSiteViewFragment on SiteView {
        name
        url
        id
        search {
            type
        }
    }
`;

const QUERY = gql`
    query AdminViewsProviderQuery($id: Int) {
        site(id: $id) {
            id
            hideDonation
            siteViews {
                ...AdminSiteViewFragment
            }
        }
    }

    ${ADMIN_SITE_VIEW_FRAGMENT}
`;

const QueryComponent = (
  props: QueryComponentOptions<AdminViewsProviderQuery, AdminViewsProviderQueryVariables>
) => Query(props);


interface AuthHeaderProps {
  user: UserFragment | null;
  history: History;
}

const StyledWrapper = styled.div`
  nav.navbar {
    background: ${props => props.theme.authHeader.headerBackground};
    margin-bottom: 0px;
    border: 0px;
    border-radius: 0px;
  }

  nav.navbar a.logo,
  nav.navbar a {
    color: ${props => props.theme.authHeader.font};
  }
  a:hover {
    color: ${props => props.theme.authHeader.hoverFont} !important;
  }

  nav.navbar .dropdown-menu a {
    color: #333;
  }

  div#logo {
    background: url(${logo}) center left no-repeat;
    background-size: 100px 30px;
    padding-left: 30px;
    color: ${props => props.theme.authHeader.logoFont};
    min-width: 110px;
    cursor: pointer;
  }
  span#small {
    font-size: 14px;
    opacity: 0.75;
  }
`;

const ThemedStyledWrapper = withTheme(StyledWrapper);

export class AuthHeader extends React.PureComponent<AuthHeaderProps> {

  pushToDefault = () => {
    // this is a temp fix to handle default hash not getting updated on logo click
      this.props.history.push('/search?sv=default')
      window.location.reload()
  }

  render() {
    return (
      <QueryComponent
        query={QUERY}>
        {({ loading, error, data }) => {
          let hideDonation = false;
          if (data?.site?.hideDonation) {
            hideDonation = data.site.hideDonation
          }
          if (error) {
            return <Error message={error.message} />;
          }
          return (
            <ThemedStyledWrapper>
              <Navbar
                collapseOnSelect
                fluid
                className="navbar-fixed-top"
                style={{ paddingLeft: '15px', paddingRight: '15px' }}>
                <Navbar.Header>
                  <Navbar.Brand>
                    <div id="logo" onClick={this.pushToDefault}>
                      <span></span>
                    </div>
                  </Navbar.Brand>
                  <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                  <Nav pullRight>
                    {hideDonation ?
                      null : <NavItem
                        target="_blank"
                        eventKey={2}
                        href="https://home.clinwiki.org/make-a-donation/">
                        Donate to ClinWiki
                        </NavItem>
                    }
                    <NavItem eventKey={1} href="https://home.clinwiki.org/" target="_blank">
                      About ClinWiki
              </NavItem>
                    <Row>
                      <UserProfileHeaderButton
                        user={this.props.user}
                        history={this.props.history}
                        data={data}
                      />
                    </Row>
                  </Nav>
                </Navbar.Collapse>
              </Navbar>
            </ThemedStyledWrapper>
          );
        }}
      </QueryComponent>
    );
  }
}

export default AuthHeader;
