import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { fetchAdminUserSite, fetchHasuraPresentSiteProvider } from 'services/site/actions';
import styled from 'styled-components';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import withTheme from 'containers/ThemeProvider/ThemeProvider';
import logo from 'images/clinwiki-501.png';
import UserProfileHeaderButton from './UserProfileHeaderButton';
import { BeatLoader } from 'react-spinners';
import { fetchPresentSiteProvider } from 'services/site/actions';


const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

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
  }s
`;

const ThemedStyledWrapper = withTheme(StyledWrapper);

const AuthHeader = (props) => {
  const dispatch = useDispatch();
  const site = useSelector((state: RootState) => state.site.hasuraPresentSiteProvider.sites[0])
  const user = useSelector((state: RootState) => state.user.current);
  const adminSiteView = useSelector((state: RootState) => state.site.adminSiteView);
  const hideDonation = adminSiteView?.site?.hideDonation;

  useEffect(() => {
    // dispatch(fetchAdminUserSite());
  }, [dispatch, user]);


  let subdomain = window.location.host.split('.')[1] ? window.location.host.split('.')[0] : "default";
  if (subdomain == "experimental" || subdomain == "staging" || subdomain == "clinwiki-node" || subdomain == "app") {
    subdomain = "default"
  }

  useEffect(() => {
    // dispatch(fetchHasuraPresentSiteProvider(undefined, subdomain));
    //dispatch(fetchPresentSiteProvider(undefined, ));
  }, [dispatch,])

  const pushToDefault = () => {
    // this is a temp fix to handle default hash not getting updated on logo click
    props.history.push(`/search?hash=${site.default_hash}&pv=${site.default_search_page}`)
    window.location.reload()
  }

  // if (!adminSiteView) {
  //   return <BeatLoader />
  // }
  return (
    <ThemedStyledWrapper>
      <Navbar
        collapseOnSelect
        fluid
        className="navbar-fixed-top"
        style={{ paddingLeft: '15px', paddingRight: '15px' }}>
        <Navbar.Header>
          <Navbar.Brand>
            <div id="logo" onClick={pushToDefault}>
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
                href="https://www.clinwiki.org/make-a-donation/">
                Donate to ClinWiki
                    </NavItem>
            }
            <NavItem eventKey={1} href="https://www.clinwiki.org/" target="_blank">
              About ClinWiki
          </NavItem>
            <Row>
              <UserProfileHeaderButton
                user={user}
                history={props.history}
                // data={adminSiteView.data}
              />
            </Row>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </ThemedStyledWrapper>
  );
}

export default AuthHeader;
