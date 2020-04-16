import * as React from 'react';
import SiteProvider from 'containers/SiteProvider';

interface ThemeProviderProps {
  // id?: number;
  // url?: string;
  // children: (site: SiteFragment, refetch: any) => React.ReactNode;
}

//this obj is more for reference than anything else
const clinwikiColors = {
  //header font color
  primaryClinwiki: '#55B88D',
  whiteHeaderFont: '#fff',
  grayHeaderFont: '#777777',
  //darkBlue for header
  navBar: '#1b2a38',
  //button Green
  button: '#55B88D',
  //hover button
  buttonHover: '#e6e6e6',
  //hover buttonborder
  buttonBorderHover: '#adadad',
  //agg side bar gray
  sideBarBackground: '#4d5863',
  //agg side bar font colors
  sideBarColor: '#bac5d0',
  sideBarColorHover: '#fff',
  sideBarTitleFont: '#fff',
  //offwhite container for crumbs and search
  containerColor: '#f2f2f2',
  //container text is usually just black
  containerText: '#000000',
  //color of actual crumb
  crumbColor: '#55b88d',
  crumbFontColor: '#fff',
};

export const withTheme = Component => {
  class ThemeProvider extends React.Component {
    theme = site => {
      //will evnetually fill this colors with colors from SiteProvider/site and potentially use these as default or fallbacks.
      const colors = {
        //header font color
        primaryColor: '#6BA5D6',
        secondaryColor: '#1b2a38',
        tertiaryColor: "#73bcdf",
        lightHeaderFont: '#fff',
        grayHeaderFont: '#777777',
        //darkBlue for header
        navBar: '#1b2a38',
        //button Green
        button: '#1b2a38',
        buttonHover: '#e6e6e6',
        buttonBorderHover: '#adadad',
        lightTextColor: '#fff',
      };

      return {
        lightTextColor: colors.lightTextColor,
        button: colors.primaryColor,
        buttonSecondary: colors.secondaryColor,
        sorterColor: colors.primaryColor,
        authHeader: {
          headerBackground: colors.primaryColor,
          font: colors.lightHeaderFont,
          hoverFont: colors.grayHeaderFont,
          logoFont: '#fff',
        },
        authButton: {
          button: colors.secondaryColor,
          buttonFont: '#fff',
          buttonHover: '#e6e6e6',
          buttonBorderHover: '#adadad',
          lightTextColor: '#fff',
        },
        aggSideBar: {
          sideBarBackground: colors.secondaryColor,
          sideBarFont: '#bac5d0',
          sideBarFontHover: '#fff',
          sideBarTitleFont: '#fff',
        },
        crumbsBar: {
          containerBackground: '#f2f2f2',
          containerFont: 'black',
          filterBarBackground: 'rgba(85, 184, 141, 0.5)',
        },
        crumbs: {
          crumbBackground: colors.primaryColor,
          crumbFont: '#fff',
        },
      };
    };

    render() {
      return (
        <SiteProvider>
          {site => <Component theme={this.theme(site)} {...this.props} />}
        </SiteProvider>
      );
    }
  }
  return ThemeProvider;
};

export default withTheme;
