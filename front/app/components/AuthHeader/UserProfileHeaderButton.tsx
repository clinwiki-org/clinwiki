import * as React from 'react';
import styled from 'styled-components';
import { logout, getStarColor } from 'utils/auth';
import * as FontAwesome from 'react-fontawesome';
import { History } from 'history';
import SiteProvider from 'containers/SiteProvider';
import withTheme, { Theme } from 'containers/ThemeProvider/ThemeProvider';
import { UserFragment } from 'types/UserFragment';

const UserButtonWrapper = styled.div``;

const UserImage = styled.img`
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
  border-radius: 5px;
  margin-top: 7px;
  background-color: ${props => props.theme.authButton.button};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  &:hover {
    background: ${props => props.theme.authButton.buttonHover};
    border-color: ${props => props.theme.authButton.buttonBorderHover};
    text-decoration: none;
  }
`;

const ThemedUserButton = withTheme(UserButton);

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
  background-color: ${props => props.theme.authButton.button};
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  &:hover {
    background: ${props => props.theme.authButton.buttonHover};
    border-color: ${props => props.theme.authButton.buttonBorderHover};
    text-decoration: none;
  }
`;

const ThemedSignInButton = withTheme(SignInButton);

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
  width: 140px;
  padding-top: 2px;
  padding-bottom: 2px;
  right: 10px;
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
  user: UserFragment | null;
  history: History;
}

interface UserProfileHeaderButtonState {
  showDropdown: boolean;
}

class UserProfileHeaderButton extends React.PureComponent<
  UserProfileHeaderButtonProps,
  UserProfileHeaderButtonState
> {
  private dropDown: HTMLDivElement;
  state = {
    showDropdown: false,
  };

  toggleMenuDropdown = () => {
    this.setState({
      showDropdown: !this.state.showDropdown,
    });
  };

  closeMenuDropdown = () => {
    this.setState({
      showDropdown: false,
    });
  };

  handleSitesClick = () => {
    this.closeMenuDropdown();
    this.props.history.push('/sites');
  };

  handleProfileClick = () => {
    this.closeMenuDropdown();
    this.props.history.push('/profile?sv=user');
  };

  handleWorkflowsClick = () => {
    this.closeMenuDropdown();
    this.props.history.push('/workflows');
  };

  handleSignInClick = () => {
    this.closeMenuDropdown();
    this.props.history.push('/sign_in');
  };

  handleSignOutClick = () => {
    this.closeMenuDropdown();
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


  renderUserImage = url => {
    if (url) {
      return (
        <UserImage
          style={{ backgroundImage: `url(${url})` }}
          // alt="profile_img"
        />
      );
    }
    return (
      <FontAwesome
        className="fa-user"
        name=" fa-user"
        style={{ marginLeft: 6, marginRight: 2, fontSize: 23 }}
      />
    );
  };

  componentWillMount() {
    document.addEventListener('mousedown', this.handleClick, false);
  }

  componentWillUnmount() {
    document.addEventListener('mousedown', this.handleClick, false);
  }

  handleClick = e => {
    if (this.dropDown.contains(e.target)) {
      return;
    }
    this.closeMenuDropdown();
  };

  render() {
    const { showDropdown } = this.state;
    const { user } = this.props;
    if (!user) {
      return (
        <ThemedSignInButton onClick={this.handleSignInClick}>
          <SignIn>Sign In</SignIn>
        </ThemedSignInButton>
      );
    }
    if (user) {
      return (
        <SiteProvider>
          {site => {
            return (
              <UserButtonWrapper
                innerRef={(node: any) => {
                  this.dropDown = node;
                }}>
                <ThemedUserButton onClick={this.toggleMenuDropdown}>
                  {this.renderUserImage(user.pictureUrl)}
                  <ContributionContainer>
                    <ContributionCount>{user.contributions}</ContributionCount>
                    <FontAwesome
                      name="pencil"
                      style={{ color: 'white', marginLeft: 2 }}
                    />
                  </ContributionContainer>
                  <FontAwesome
                    name="star"
                    style={{
                      color: getStarColor(user.rank),
                      fontSize: 18,
                    }}
                  />

                  <FontAwesome
                    name="chevron-down"
                    style={{ color: 'white', fontSize: 10 }}
                  />
                </ThemedUserButton>
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
              </UserButtonWrapper>
            );
          }}
        </SiteProvider>
      );
    }
  }
}

export default UserProfileHeaderButton;
