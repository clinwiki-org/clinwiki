import React, { Component, createRef } from 'react';
import styled from 'styled-components';
import { logout } from 'utils/auth';
import * as FontAwesome from 'react-fontawesome';
import { History } from 'history';
import SiteProvider from 'containers/SiteProvider';
import withTheme, { Theme } from 'containers/ThemeProvider/ThemeProvider';

const UserImage = styled.img`
  background-image: url(https://avatars2.githubusercontent.com/u/30156105?s=460&u=a9ecf403d3a8771213f09ec4d9c3db28a7722459&v=4);
  width: 25px;
  height: 25px;
  border-radius: 15%;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  margin-right: 5px;
`;

const UserButton = styled.div`
  min-width: 120px;
  height: 35px;
  padding: 5px;
  border-radius: 7%;
  margin-top: 7px;
  background-color: #6ba5d6;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

const ContributionCount = styled.div`
  font-size: 16px;
  font-weight: 400;
  text-align: center;
  color: white;
`;

const SignInButton = styled.div`
  height: 35px;
  padding: 5px 10px;
  border-radius: 7%;
  margin-top: 7px;
  background-color: #6ba5d6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

const SignIn = styled.div`
  font-size: 14px;
  font-weight: 400;
  text-align: center;
  color: #fff;
`;

const ContributionContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-right: 4px;
`;

const DropDownMenu = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  border: 1px solid rgba(27, 31, 35, 0.15);
  background-color: #fff;
  position: absolute;
  z-index: 100;
  top: 100%;
  width: 120px;
  padding-top: 2px;
  padding-bottom: 2px;
`;

const DropDownEmail = styled.div`
  background-color: #fff;
  color: #24292e;
  padding: 4px 8px 4px 16px;
`;

const DropDownItem = styled.div`
  background-color: #fff;
  color: #24292e;
  padding: 4px 8px 4px 16px;
  cursor: pointer;
  text-decoration: none;
  &:hover {
    background: ${props => props.theme.button};
    border-color: ${props => props.theme.authButton.buttonBorderHover};
    color: #fff;
    text-decoration: none;
  }
`;

const ThemedDropDownItem = withTheme(DropDownItem);

const ContributionText = styled.div`
  font-size 12px;
  font-weight: 200;
  text-align: center;
  color: white;
`;

const Row = styled.div``;

interface UserProfileHeaderButtonProps {
  user: {
    email: string;
    roles: string[];
  } | null;
  history: History;
}

interface UserProfileHeaderButtonState {
  showDropdown: boolean;
}

class UserProfileHeaderButton extends React.PureComponent<
  UserProfileHeaderButtonProps,
  UserProfileHeaderButtonState
> {
  private myRef = createRef<HTMLDivElement>();
  state = {
    showDropdown: false,
  };

  toggleMenuDropdown = () => {
    this.setState({
      showDropdown: !this.state.showDropdown,
    });
  };

  handleSitesClick = () => {
    this.toggleMenuDropdown();
    this.props.history.push('/sites');
  };

  handleProfileClick = () => {
    this.toggleMenuDropdown();
    this.props.history.push('/profile?sv=user');
  };

  handleWorkflowsClick = () => {
    this.toggleMenuDropdown();
    this.props.history.push('/workflows');
  };

  handleSignInClick = () => {
    this.toggleMenuDropdown();
    this.props.history.push('/sign_in');
  };

  handleSignOutClick = () => {
    this.toggleMenuDropdown();
    logout(this.props.history);
  };

  handleAdminClick = url => {
    const linkUrl = '/search/' + url;
    this.props.history.push(linkUrl);
  };

  renderAdminMenuItems = site => {
    const adminViews = site.siteViews.filter(
      siteview => siteview.search.type === 'admin'
    );
    return adminViews.map(view => {
      return (
        <DropDownItem onClick={() => this.handleAdminClick(view.url)}>
          {view.name}
        </DropDownItem>
      );
    });
  };

  componentWillMount() {
    document.addEventListener('mousedown', this.handleClick, false);
  }

  componentWillUnmount() {
    document.addEventListener('mousedown', this.handleClick, false);
  }

  handleClickOutside = () => {};

  handleClick = e => {
    // if (this.myRef.contains(e.target)) {
    //   return;
    // }
    this.handleClickOutside();
  };

  render() {
    const { showDropdown } = this.state;
    if (!this.props.user) {
      return (
        <SignInButton onClick={this.handleSignInClick}>
          <SignIn>Sign In</SignIn>
        </SignInButton>
      );
    }
    return (
      <SiteProvider>
        {site => {
          return (
            <div ref={this.myRef}>
              <UserButton onClick={this.toggleMenuDropdown}>
                <UserImage
                  src="https://avatars2.githubusercontent.com/u/30156105?s=460&u=a9ecf403d3a8771213f09ec4d9c3db28a7722459&v=4"
                  alt="profile_img"
                />
                <ContributionContainer>
                  <ContributionCount>35</ContributionCount>
                  <FontAwesome
                    name="pencil"
                    style={{ color: 'white', marginLeft: 2 }}
                  />
                </ContributionContainer>
                <FontAwesome
                  name="star"
                  style={{ color: 'gold', fontSize: 18 }}
                />

                <FontAwesome
                  name="chevron-down"
                  style={{ color: 'white', fontSize: 10 }}
                />
              </UserButton>
              {showDropdown && (
                <DropDownMenu>
                  {/* <DropDownEmail>
                    {this.props.user?.email && `Signed in as:`}
                  </DropDownEmail>
                  <DropDownEmail>
                    <b>
                      {this.props.user?.email && `${this.props.user.email}`}
                    </b>
                  </DropDownEmail> */}
                  <ThemedDropDownItem onClick={this.handleSitesClick}>
                    Sites
                  </ThemedDropDownItem>
                  <ThemedDropDownItem onClick={this.handleProfileClick}>
                    Profile
                  </ThemedDropDownItem>
                  {this.props.user &&
                    this.props.user.roles.includes('admin') && (
                      <ThemedDropDownItem onClick={this.handleWorkflowsClick}>
                        Workflows
                      </ThemedDropDownItem>
                    )}
                  {this.renderAdminMenuItems(site)}
                  <ThemedDropDownItem onClick={this.handleSignOutClick}>
                    Log Out
                  </ThemedDropDownItem>
                </DropDownMenu>
              )}
            </div>
          );
        }}
      </SiteProvider>
    );
  }
}

export default UserProfileHeaderButton;
