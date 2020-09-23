import * as React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { History } from 'history';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import withTheme from 'containers/ThemeProvider/ThemeProvider';
import logo from 'images/clinwiki-501.png';
import UserProfileHeaderButton from './UserProfileHeaderButton';
import { UserFragment } from 'types/UserFragment';

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

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

  a#logo {
    background: url(${logo}) center left no-repeat;
    background-size: 100px 30px;
    padding-left: 30px;
    color: ${props => props.theme.authHeader.logoFont};
    min-width: 110px;
  }
  span#small {
    font-size: 14px;
    opacity: 0.75;
  }
`;

const ThemedStyledWrapper = withTheme(StyledWrapper);

export class AuthHeader extends React.PureComponent<AuthHeaderProps> {
  render() {
    let showDonation = true;
    return (
      <ThemedStyledWrapper>
        <Navbar
          collapseOnSelect
          fluid
          className="navbar-fixed-top"
          style={{ paddingLeft: '15px', paddingRight: '15px' }}>
          <Navbar.Header>
            <Navbar.Brand>
              <Link id="logo" to="/search?sv=default">
                <span></span>
              </Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
              {showDonation ?
                <NavItem
                  target="_blank"
                  eventKey={2}
                  href="https://home.clinwiki.org/make-a-donation/">
                  Donate to ClinWiki
              </NavItem> : null
              }
              <NavItem eventKey={1} href="https://home.clinwiki.org/" target="_blank">
                About ClinWiki
              </NavItem>
              <Row>
                <UserProfileHeaderButton
                  user={this.props.user}
                  history={this.props.history}
                />
              </Row>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </ThemedStyledWrapper>
    );
  }
}

export default AuthHeader;
