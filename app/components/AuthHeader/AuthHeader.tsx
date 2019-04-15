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

const SearchInputWrapper = styled.div`
  margin-top: 7px;
  margin-right: 15px;
`;

export class AuthHeader extends React.PureComponent<AuthHeaderProps> {
  render() {
    return (
      <Navbar fluid>
        <Navbar.Header>
          <Navbar.Brand>
            <Link id="logo" to="/">
              ClinWiki
            </Link>
          </Navbar.Brand>
        </Navbar.Header>
        <AuthButton user={this.props.user} history={this.props.history} />
        {/* <SearchInputWrapper className="pull-right">
          <SearchInput />
        </SearchInputWrapper> */}
      </Navbar>
    );
  }
}

export default AuthHeader;
