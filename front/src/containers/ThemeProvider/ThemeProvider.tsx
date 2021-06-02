import * as React from 'react';
//import PresentSiteProvider from 'containers/PresentSiteProvider';
import { useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHasuraPresentSiteProvider, fetchPresentSiteProvider } from 'services/site/actions';
import { RootState } from 'reducers';
import { BeatLoader } from 'react-spinners';

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
    containerBackground: string;
    containerFont: '#333';
    filterBarBackground: 'rgba(85, 184, 141, 0.5)';
  };
  crumbs: {
    crumbBackground: string;
    crumbFont: string;
  };
  crumbs2: {
    crumbBackground2: string;
    crumbFont2: string;
  };
  crumbs3: {
    crumbBackground3: string;
    crumbFont3: string;
  };
  crumbs4: {
    crumbBackground4: string;
    crumbFont4: string;
  };
  presearch: {
    presearchHeaders: string;
    presearchLabelColor: string;
    presearchLabelTextColor: string;
    presearchCardMargin: string;
    presearchBorderColor: string;
  };
  search: {
    searchContainerBg: string;
  }
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
    primaryColor2: '#6BA5D6',
    primaryColor3: '#6BA5D6',
    primaryColor4: '#6BA5D6',
    secondaryColor: '#1b2a38',
    lightTextColor: '#fff',
    lightTextColor2: '#fff',
    lightTextColor3: '#fff',
    lightTextColor4: '#fff',
    secondaryTextColor: '#777',
    backgroundColor: '#fff',
    primaryAltColor: '#4889BF',
    sideBarColor: '#4d5762',
    authHeaderColor: '#5786AD',
    presearchLabelColor: "#6BA5D6",
    presearchLabelTextColor: "#fff",
    presearchCardMargin: '10px',
    presearchBorderColor: "#e7e7e7",
    searchContainerBg: "#ffffff"
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
    primaryColor2: thisTheme.primaryColor2 || '#6BA5D6',
    primaryColor3: thisTheme.primaryColor3 || '#6BA5D6',
    primaryColor4: thisTheme.primaryColor4 || '#6BA5D6',
    secondaryColor: thisTheme.secondaryColor || '#1b2a38',
    lightTextColor: thisTheme.lightTextColor || '#fff',
    lightTextColor2: thisTheme.lightTextColor2 || '#fff',
    lightTextColor3: thisTheme.lightTextColor3 || '#fff',
    lightTextColor4: thisTheme.lightTextColor4 || '#fff',
    secondaryTextColor: thisTheme.secondaryTextColor || '#777',
    backgroundColor: thisTheme.backgroundColor || '#fff',
    primaryAltColor: thisTheme.primaryAltColor || '#4889BF',
    sideBarColor: thisTheme.sideBarColor || '#4d5762',
    authHeaderColor: thisTheme.authHeaderColor || '#5786AD',
    presearchLabelColor: thisTheme.presearchLabelColor || '#6BA5D6',
    presearchLabelTextColor: thisTheme.presearchLabelTextColor || 'white',
    presearchCardMargin: thisTheme.presearchCardMargin || '10px',
    presearchBorderColor: thisTheme.presearchBorderColor || '#e7e7e7',
    grayHeaderFont: '#777777',
    buttonHover: '#e6e6e6',
    buttonBorderHover: '#adadad',
    errorColor: 'red',
    warningColor: '#ffcc00',
    warningAltColor: '#f6a202',
    warningTertiaryColor: '#ff6d36',
    searchContainerBg: thisTheme.searchContainerBg || "#ffffff"
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
      containerBackground: colors.searchContainerBg,
      containerFont: '#333',
      filterBarBackground: 'rgba(85, 184, 141, 0.5)',
    },
    crumbs: {
      crumbBackground: colors.primaryColor,
      crumbFont: colors.lightTextColor,
    },
    crumbs2: {
      crumbBackground2: colors.primaryColor2,
      crumbFont2: colors.lightTextColor2,
    },
    crumbs3: {
      crumbBackground3: colors.primaryColor3,
      crumbFont3: colors.lightTextColor3,
    },
    crumbs4: {
      crumbBackground4: colors.primaryColor4,
      crumbFont4: colors.lightTextColor4,
    },
    presearch: {
      presearchHeaders: colors.primaryColor,
      presearchLabelTextColor: colors.presearchLabelTextColor,
      presearchLabelColor: colors.presearchLabelColor,
      presearchCardMargin: colors.presearchCardMargin,
      presearchBorderColor: colors.presearchBorderColor,
    },
    search: {
      searchContainerBg: colors.searchContainerBg
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

  const url =
    window.location.search;
  const urlName = new URLSearchParams(url)
    .getAll('sv')
    .toString();
  const urlFinal = urlName ? urlName : "default";


  let subdomain = window.location.host.split('.')[1] ? window.location.host.split('.')[0] : "default";
  if (subdomain == "experimental" || subdomain == "staging" || subdomain == "clinwiki-node") {
    subdomain = "default"
  }

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchHasuraPresentSiteProvider(subdomain));
    dispatch(fetchPresentSiteProvider(undefined, urlFinal));
  }, [])

  //const isLoading = useSelector((state : RootState) => state.site.isFetchingPresentSiteProvider)
  /*  const site = useSelector((state: RootState) => {
     if (!state.site.presentSiteProvider) {
       return
     }
     return (
       state?.site.presentSiteProvider.site
     )
   }
   ) */

  const site = useSelector((state: RootState) => {
    if (!state.site.hasuraPresentSiteProvider) {
      return
    }
    return (
      state?.site.hasuraPresentSiteProvider.sites[0]
    )
  }
  )

  if (!site) {
    return <BeatLoader />
  }

  return (
    <ThemeContext.Provider
      value={staticTheme || (staticTheme = themeFromSite(site))}>
      {children}
    </ThemeContext.Provider>
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
