import * as React from 'react';
import PresentSiteProvider from 'containers/PresentSiteProvider';
import { useContext } from 'react';

// This type is really long but I don't think we'll have to change it very often
export interface Theme {
  button: string;
  buttonSecondary: string;
  buttonDanger: string;
  buttonDisabled: string;
  sorterColor: string;
  backgroundColor: string;
  authHeader: {
    headerBackground: string;
    font: string;
    hoverFont: string;
    logoFont: string;
  };
  authPage: {
    signInLinks: string;
    signInLinksHover: string;
  };
  authButton: {
    button: string;
    buttonFont: string;
    buttonHover: '#e6e6e6';
    buttonBorderHover: '#adadad';
    lightTextColor: string;
  };
  aggSideBar: {
    sideBarBackground: string;
    sideBarFont: '#bac5d0';
    sideBarFontHover: string;
    sideBarTitleFont: string;
  };
  crumbsBar: {
    containerBackground: '#f2f2f2';
    containerFont: '#333';
    filterBarBackground: 'rgba(85, 184, 141, 0.5)';
  };
  crumbs: {
    crumbBackground: string;
    crumbFont: '#fff';
  };
  presearch: {
    presearchHeaders: string;
  };
  searchResults: {
    resultsHeaderBackground: string;
    resultsRowHighlight: string;
    resultsPaginationButtons: string;
  };
  studyPage: {
    sectionBorderColor: string;
    reviewStarColor: string;
    studyPageHeader: string;
    panelHeading: string;
  };
  mapSection: {
    markerFontColor: string;
    markerBorderColor: string;
    facilityCardColor: string;
    warningBorderColor: string;
    warningFontColor: string;
    errorBorderColor: string;
    errorFontColor: string;
    facilityWarningColor: string;
    facilityErrorColor: string;
    facilityWarningPointer: string;
    facilityErrorPointer: string;
  };
}

function themeFromSite(site): Theme {
  const themeString = site.themes;
  //fallback colors
  let thisTheme = {
    primaryColor: '#6BA5D6',
    secondaryColor: '#1b2a38',
    lightTextColor: '#fff',
    secondaryTextColor: '#777',
    backgroundColor: '#4D5863;',
    primaryAltColor: '#4889BF',
    sideBarColor: '#4d5762',
    authHeaderColor: '#5786AD',
  };
  // if JSON PARSE IS SUCCESSFUL we take the theme. if not we fall back to the above object.
  if (
    /^[\],:{}\s]*$/.test(
      themeString
        .replace(/\\["\\/bfnrtu]/g, '@')
        .replace(
          /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?/g,
          ']'
        )
        .replace(/(?:^|:|,)(?:\s*\[)+/g, '')
    )
  ) {
    thisTheme = JSON.parse(site.themes);
  }
  // will evnetually fill this colors with colors from PresentSiteProvider/site and potentially use these as default or fallbacks.
  const colors = {
    //header font color
    primaryColor: thisTheme.primaryColor || '#6BA5D6',
    secondaryColor: thisTheme.secondaryColor || '#1b2a38',
    lightTextColor: thisTheme.lightTextColor || '#fff',
    secondaryTextColor: thisTheme.secondaryTextColor || '#777',
    backgroundColor: thisTheme.backgroundColor || '#4D5863',
    primaryAltColor: thisTheme.primaryAltColor || '#4889BF',
    sideBarColor: thisTheme.sideBarColor || '#4d5762',
    authHeaderColor: thisTheme.authHeaderColor || '#5786AD',
    grayHeaderFont: '#777777',
    buttonHover: '#e6e6e6',
    buttonBorderHover: '#adadad',
    errorColor: 'red',
    warningColor: '#ffcc00',
    warningAltColor: '#f6a202',
    warningTertiaryColor: '#ff6d36',
  };

  //this is the master map of our theme.
  return {
    button: colors.primaryColor,
    buttonSecondary: colors.secondaryColor,
    buttonDanger: colors.warningColor,
    buttonDisabled: colors.grayHeaderFont,
    sorterColor: colors.primaryColor,
    backgroundColor: colors.backgroundColor,

    authHeader: {
      headerBackground: colors.authHeaderColor,
      font: colors.lightTextColor,
      hoverFont: colors.secondaryTextColor,
      logoFont: colors.lightTextColor,
    },
    authPage: {
      signInLinks: colors.lightTextColor,
      signInLinksHover: colors.secondaryTextColor,
    },
    authButton: {
      button: colors.primaryColor,
      buttonFont: colors.lightTextColor,
      buttonHover: '#e6e6e6',
      buttonBorderHover: '#adadad',
      lightTextColor: colors.lightTextColor,
    },
    aggSideBar: {
      sideBarBackground: colors.sideBarColor,
      sideBarFont: '#bac5d0',
      sideBarFontHover: colors.lightTextColor,
      sideBarTitleFont: colors.lightTextColor,
    },
    crumbsBar: {
      containerBackground: '#f2f2f2',
      containerFont: '#333',
      filterBarBackground: 'rgba(85, 184, 141, 0.5)',
    },
    crumbs: {
      crumbBackground: colors.primaryColor,
      crumbFont: '#fff',
    },
    presearch: {
      presearchHeaders: colors.primaryColor,
    },
    searchResults: {
      resultsHeaderBackground: colors.primaryColor,
      resultsRowHighlight: colors.primaryAltColor,
      resultsPaginationButtons: colors.primaryColor,
    },
    studyPage: {
      sectionBorderColor: colors.primaryColor,
      reviewStarColor: colors.primaryColor,
      studyPageHeader: colors.sideBarColor,
      panelHeading: colors.primaryColor,
    },
    mapSection: {
      markerFontColor: colors.primaryColor,
      markerBorderColor: colors.secondaryColor,
      facilityCardColor: colors.primaryColor,
      warningBorderColor: colors.warningColor,
      warningFontColor: colors.warningAltColor,
      errorBorderColor: colors.errorColor,
      errorFontColor: colors.errorColor,
      facilityWarningColor: colors.warningTertiaryColor,
      facilityErrorColor: colors.errorColor,
      facilityWarningPointer: colors.warningColor,
      facilityErrorPointer: colors.errorColor,
    },
  };
}

export const ThemeContext = React.createContext({} as Theme | null);
let staticTheme: Theme | null = null;

export const ProvideTheme = ({ children }) => {
  return (
    <PresentSiteProvider>
      {site => {
        return (
          <ThemeContext.Provider
            value={staticTheme || (staticTheme = themeFromSite(site))}>
            {children}
          </ThemeContext.Provider>
        );
      }}
    </PresentSiteProvider>
  );
};

export function withTheme<T>(
  Component: React.ComponentType<T>
): React.ComponentClass<Omit<T, 'theme'>> {
  class ThemeProvider extends React.Component<Omit<T, 'theme'>> {
    render() {
      return (
        <ThemeContext.Consumer>
          {theme =>
            theme ? <Component theme={theme} {...(this.props as T)} /> : null
          }
        </ThemeContext.Consumer>
      );
    }
  }
  return ThemeProvider;
}

export function useTheme() {
  const theme = useContext(ThemeContext);
  return theme;
}

export default withTheme;
