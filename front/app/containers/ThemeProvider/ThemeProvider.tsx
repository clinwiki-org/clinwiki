import * as React from 'react';

interface ThemeProviderProps {
  // id?: number;
  // url?: string;
  // children: (site: SiteFragment, refetch: any) => React.ReactNode;
}

//this obj is more for reference than anything else
const clinwikiColors = {
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

export const withTheme = Component => {
  class ThemeProvider extends React.Component {
    theme = () => {
      let primaryColor = 'white';
      let secondaryColor = 'purple';
      return {
        primaryColor: 'white',
        secondaryColor: 'purple',
        authHeader: {
          headerBackground: '#1b2a38',
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
      };
    };

    render() {
      return <Component theme={this.theme()} {...this.props} />;
    }
  }
  return ThemeProvider;
};

export default withTheme;
