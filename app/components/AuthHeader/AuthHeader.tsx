import * as React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { History } from 'history';

import { Navbar } from 'react-bootstrap';

import AuthButton from 'components/AuthButton';
// import SearchInput from 'components/SearchInput';

interface AuthHeaderProps {
  user: {
    email: string;
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
    background: url('clinwiki-50.png') center
      left no-repeat;
    background-size: 25px 25px;
    margin-left: 1px;
    padding-left: 30px;
    color: #fff;
  }
`;

export class AuthHeader extends React.PureComponent<AuthHeaderProps> {
  render() {
    return (
      <StyledWrapper>
        <Navbar fluid>
          <Navbar.Header>
            <Navbar.Brand>
              <Link id="logo" to="/search">
                ClinWiki
              </Link>
            </Navbar.Brand>
            <ul className="nav navbar-nav">
              {true ? null : <li><a href="/search">Search</a></li>}
              <li><a href="/about">About</a></li>
            </ul>
          </Navbar.Header>
          <AuthButton user={this.props.user} history={this.props.history} />
          {/* <SearchInputWrapper className="pull-right">
          <SearchInput />
        </SearchInputWrapper> */}
        </Navbar>
      </StyledWrapper>
    );
  }
}

export default AuthHeader;
