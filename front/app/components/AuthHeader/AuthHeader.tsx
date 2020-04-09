import * as React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { History } from 'history';

import { Navbar, Nav, NavItem } from 'react-bootstrap';

import AuthButton from 'components/AuthButton';
// import SearchInput from 'components/SearchInput';

interface AuthHeaderProps {
  user: {
    email: string;
    roles: string[];
  } | null;
  history: History;
}

const StyledWrapper = styled.div`
  nav.navbar {
    background: #1b2a38;
    margin-bottom: 0px;
    border: 0px;
    border-radius: 0px;
  }

  nav.navbar a.logo {
    color: #fff;
  }
  a:hover {
    color: #fff !important;
  }

  a#logo {
    background: url('/clinwiki-50.png') center left no-repeat;
    background-size: 25px 25px;
    margin-left: 1px;
    padding-left: 30px;
    color: #fff;
  }
  span#small {
    font-size: 14px;
    opacity: 0.75;
  }
`;

export class AuthHeader extends React.PureComponent<AuthHeaderProps> {
  render() {
    return (
      <StyledWrapper>
        <Navbar
          collapseOnSelect
          fluid
          className="navbar-fixed-top"
          style={{ paddingLeft: '15px', paddingRight: '15px' }}>
          <Navbar.Header>
            <Navbar.Brand>
              <Link id="logo" to="/search?sv=default">
                ClinWiki <span id="small">(beta)</span>
              </Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
              {true ? null : (
                <NavItem eventKey={1} href="/search?sv=default">
                  Search
                </NavItem>
              )}
              <NavItem eventKey={1} href="https://home.clinwiki.org/">
                About
              </NavItem>
              <AuthButton user={this.props.user} history={this.props.history} />
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </StyledWrapper>
    );
  }
}

export default AuthHeader;
