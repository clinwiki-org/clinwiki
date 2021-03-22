import { SITE_FRAGMENT } from '../site/SiteFragments';

export const UPDATE_SITE_MUTATION = `                                               
  mutation UpdateSiteMutation($input: UpdateSiteInput!, $url: String) {             
    updateSite(input: $input) {                                                     
      site {                                                                        
        ...SiteFragment                                                             
      }                                                                             
      errors                                                                        
    }                                                                               
  }                                                                                 
                                                                                    
  ${SITE_FRAGMENT}                                                                  
`;                   
