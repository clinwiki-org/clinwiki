import * as React from 'react';
import { SiteFragment } from 'services/site/model/SiteFragment';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { fetchSiteProvider } from 'services/site/actions';


interface SiteProviderProps {
  id?: number;
  url?: string;
  children: any; // (site: SiteFragment) => JSX.Element | null;
  from?: string;
}


interface UseSiteProps {
  id?: number | any;
  url?: string | any;
}
/* export function useSite(props?: UseSiteProps) {

  const dispatch = useDispatch();
  
  console.log("USE SITE PROPS", props);
  // console.trace();
  const urlName = new URLSearchParams(window.location.search)
  .getAll('sv')
  .toString()
  .toLowerCase();
  
  console.log("🚀 ~ file: SiteProvider.tsx ~ line 27 ~ useSite ~ urlName", urlName);
  
  dispatch(fetchSiteProvider(props?.id, props?.url));
  
  const siteProvider = useSelector((state : RootState ) => state.site.siteProvider)

  console.log("🚀 ~useSite ~ siteProvider", siteProvider);
  const isFetchingSiteProvider = useSelector((state : RootState) => state.site.isFetchingSiteProvider)


  const result = siteProvider

  //TODO replace with useSelector to check results /data and pull site

  if (!result) return { ...result, site: null, currentSiteView: null };
  if (!isFetchingSiteProvider && result.siteProvider ) {
    const site = siteProvider.site;
    const currentSiteView =
    site?.siteViews.find(
      siteview => siteview?.url?.toLowerCase() === urlName
      ) || site?.siteView;
      
      console.log("🚀 ~ file:   CURRENT SITE VIEW *****************", currentSiteView);
      
    return { site, currentSiteView };
  }
} */


function SiteProvider(props: SiteProviderProps) {
  console.log(props?.from)
  //ts-ignore
 // const useSiteData = useSite(props);  //TODO CHECK this  

 const dispatch = useDispatch();
  
 console.log("USE SITE PROPS", props);
 // console.trace();
 const urlName = new URLSearchParams(window.location.search)
 .getAll('sv')
 .toString()
 .toLowerCase();
 
 console.log("🚀 ~ urlName", urlName);
 
 dispatch(fetchSiteProvider(props?.id, props?.url));
 
 const isFetchingSiteProvider = useSelector((state : RootState) => state.site.isFetchingSiteProvider)

 const siteProvider = useSelector((state : RootState ) => state.site.siteProvider)
 console.log("🚀 ~useSite ~ siteProvider", siteProvider);
  //! THiS ^^^ IS COMING BACK UNDEFINED, seems it's not done fetching the data, and we can't useSelector() inside a conditional to make sure fetching is false.

 //const result = siteProvider
 
 //if (!result) return { ...result, site: null, currentSiteView: null };
 if (!isFetchingSiteProvider ) {
   
   const site = siteProvider.site;
   const currentSiteView =
   site?.siteViews.find(
     siteview => siteview?.url?.toLowerCase() === urlName
     ) || site?.siteView;
     
     console.log("🚀 ~ file:   CURRENT SITE VIEW *****************", currentSiteView);
     
     return props.children(site);
  // return <>{ site, currentSiteView }</>;
 }
}

export default SiteProvider;



/*   console.log("🚀 ~ file: useSiteData props", props);
  //console.log("🚀 ~  SiteProvider ~ currentSiteView", currentSiteView);
  const data = useSelector((state : RootState ) => state.site.siteProvider)
  const loading = useSelector((state : RootState) => state.site.isFetchingSiteProvider)
  //if (error) console.log(error);
  if (loading || !data) return null;
  return props.children(data.site!, "currentSiteView"); */


