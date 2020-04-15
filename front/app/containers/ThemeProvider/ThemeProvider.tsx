import * as React from 'react';
import SiteProvider from 'containers/SiteProvider';

interface ThemeProviderProps {
  // id?: number;
  // url?: string;
  // children: (site: SiteFragment, refetch: any) => React.ReactNode;
}

//this obj is more for reference than anything else
const clinwikiColors = {
  primaryClinwiki: '#6BA5D6',
  //header font color
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
  //agg side bar font
  sideBarColor: '#bac5d0',
  sideBarColorHover: '#fff',
};

export const withTheme = Component => {
  class ThemeProvider extends React.Component {
    theme = site => {
      //will evnetually fill this colors with colors from SiteProvider/site and potentially use these as default or fallbacks.
      const colors = {
        //clinwiki defaults?
        primaryColor: '#6BA5D6',
        secondaryColor: '#1b2a38',
        //header font color
        whiteHeaderFont: '#fff',
        grayHeaderFont: '#777777',
        //darkBlue for header
        navBar: '#1b2a38',
        //button Green
        button: '#55B88D',
        buttonHover: '#e6e6e6',
        buttonBorderHover: '#adadad',
      };
      return {
        authHeader: {
          headerBackground: colors.primaryColor,
          font: '#777777',
          hoverFont: '#fff',
          logoFont: '#fff',
        },
        authButton: {
          button: '#55B88D',
          buttonFont: '#fff',
          buttonHover: '#e6e6e6',
          buttonBorderHover: '#adadad',
        },
        aggSideBar: {
          sideBarBackground: '#4d5863',
          sideBarFont: '#bac5d0',
          sideBarFontHover: '#fff',
          sideBarTitleFont: '#fff',
        },
      };
    };


   render() {
     return (
       <SiteProvider>
        {(site) => 
        <Component
          theme={this.theme(site)}
        {...this.props}
       />
        }
       </SiteProvider>
     )
   }
  }
  return ThemeProvider;
};

export default withTheme;
