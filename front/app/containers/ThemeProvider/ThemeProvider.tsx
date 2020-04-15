import * as React from 'react';
import SiteProvider from 'containers/SiteProvider';


interface ThemeProviderProps {
  // id?: number;
  // url?: string;
  // children: (site: SiteFragment, refetch: any) => React.ReactNode;
}



export const withTheme = (Component)  =>  {
 class ThemeProvider extends React.Component {

   theme = (site) => {
     console.log(site);
     return {
       primaryColor: 'white',
       secondaryColor: 'purple'
     }
   }

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
  return ThemeProvider
}


export default withTheme;
