import * as React from 'react';


interface ThemeProviderProps {
  // id?: number;
  // url?: string;
  // children: (site: SiteFragment, refetch: any) => React.ReactNode;
}



export const withTheme = (Component)  =>  {
 class ThemeProvider extends React.Component {

   theme = () => {
     return {
       primaryColor: 'white',
       secondaryColor: 'purple'
     }
   }

   render() {
     return (
       <Component
        theme={this.theme()}
       {...this.props}
       />
     )
   }
  }
  return ThemeProvider
}


export default withTheme;
