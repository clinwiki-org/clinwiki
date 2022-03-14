import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from 'services/user/actions';
import styled, { keyframes } from 'styled-components';
import { getStarColor } from 'utils/auth';
import * as FontAwesome from 'react-fontawesome';
import { History } from 'history';
import withTheme from 'containers/ThemeProvider/ThemeProvider';
import { UserFragment } from 'services/user/model/UserFragment';
import { isAdmin } from 'utils/auth';
// import { AdminViewsProviderQuery } from 'services/site/model/AdminViewsProviderQuery';


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
  // min-width: 120px;
  height: 35px;
  padding: 5px;
  border-radius: 5px;
  margin-top: 7px;
  background-color: ${(props) => props.theme.authButton.button};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  &:hover {
    background: ${(props) => props.theme.authButton.buttonHover};
    border-color: ${(props) => props.theme.authButton.buttonBorderHover};
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
  background-color: ${(props) => props.theme.authButton.button};
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  &:hover {
    background: ${(props) => props.theme.authButton.buttonHover};
    border-color: ${(props) => props.theme.authButton.buttonBorderHover};
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

const DropDownItem = styled.div`
  background-color: #fff;
  color: #24292e;
  padding: 4px 8px 4px 16px;
  cursor: pointer;
  text-decoration: none;
  &:hover {
    background: ${(props) => props.theme.button};
    border-color: ${(props) => props.theme.authButton.buttonBorderHover};
    color: #fff;
    text-decoration: none;
  }
`;

const ThemedDropDownItem = withTheme(DropDownItem);
const flashKeyFrames = keyframes`
  0% {
    opacity: 0;

  }
  25%{
    opacity:0.5
  }
  50%{
    opacity: 1;

  }

  75%{
      opacity:0.75;

  }100%{
    opacity: 0;

  }

`
export const HeaderAnimation = styled.div`


display:inline-block;
background: transparent;
width: 25px;
opacity:0;

animation-name: ${flashKeyFrames};
animation-duration: 2.5s;
animation-timing-function: ease;
animation-delay: 0s;
animation-iteration-count: 1;
animation-direction: normal;
animation-fill-mode: forwards;
animation-play-state: running;

`

interface UserProfileHeaderButtonProps {
  user: UserFragment | null;
  history: History;

  // data: AdminViewsProviderQuery | undefined;
}
const UserProfileHeaderButton = ({ user, history }: UserProfileHeaderButtonProps) => {

  const dispatch = useDispatch();
  const [showDropdown, setShowDropdown] = useState(false);
  const [flashAnimation, setFlashAnimation] = useState(false);
  const [dropDown, setDropdown] = useState(undefined);

  const toggleMenuDropdown = () => setShowDropdown(!showDropdown);

  const closeMenuDropdown = () => setShowDropdown(false);

  const handleSitesClick = () => {
    closeMenuDropdown();
    history.push('/admin?&pv=dashboard');
  };

  const handleProfileClick = () => {
    closeMenuDropdown();
    history.push('/profile?sv=user');
  };

  const handleWorkflowsClick = () => {
    closeMenuDropdown();
    history.push('/workflows');
  };
  const handleAggIslandsClick = () => {
    closeMenuDropdown();
    history.push('/aggIslands');
  };

  const handleSignInClick = () => {
    closeMenuDropdown();
    history.push('/sign_in');
  };

  const handleAdminClick = (url) => {
    const linkUrl = '/search/' + url;
    history.push(linkUrl);
  };

  const renderAdminMenuItems = (site) => {
    // if(!site) return null;
    // const adminViews = site.siteViews.filter(
    //   (siteview) => siteview.search.type === 'admin'
    // );
    // return adminViews.map((view) => {
    //   return (
    //     <ThemedDropDownItem onClick={() => handleAdminClick(view.url)}>
    //       {view.name}
    //     </ThemedDropDownItem>
    //   );
    // });
  };

  const renderUserImage = (url) => {
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

  if (!user) {
    return (
      <ThemedSignInButton onClick={handleSignInClick}>
        <SignIn>Sign In</SignIn>
      </ThemedSignInButton>
    );
  }
  return (
    <div
      ref={(node: any) => {
        setDropdown(node);
      }}>
      <ThemedUserButton onClick={toggleMenuDropdown}>
        {renderUserImage(user.picture_url)}
        {/* <ContributionContainer>
            <ContributionCount>{user.contributions}</ContributionCount>
            <FontAwesome
              name="pencil"
              style={{ color: 'white', marginLeft: 2 }}
            />
          </ContributionContainer>
          {flashAnimation === true ?
            <HeaderAnimation>
              <FontAwesome
                name="star"
                style={{
                  color: getStarColor(user.rank),
                  fontSize: 18,
                }}
              />
            </HeaderAnimation>
            :
            <FontAwesome
              name="star"
              style={{
                color: getStarColor(user.rank),
                fontSize: 18,
              }}
            />
          } */}

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
            <ThemedDropDownItem onClick={handleProfileClick}>
              Profile
            </ThemedDropDownItem>
            {isAdmin(user) ? (
              <>
                <ThemedDropDownItem onClick={handleSitesClick}>
                  Dashboard
                </ThemedDropDownItem>
                <ThemedDropDownItem onClick={() => {
                  closeMenuDropdown();
                  history.push('/reindex');
                }}>Reindex</ThemedDropDownItem>
              </>
            ) : null}
            {/* {renderAdminMenuItems(data?.site)} */}
            <ThemedDropDownItem onClick={() => {
              closeMenuDropdown();
              dispatch(logout());
            }}>
              Log Out
            </ThemedDropDownItem>
          </DropDownMenu>
        )}
      </div>
    );

}

export default UserProfileHeaderButton;
