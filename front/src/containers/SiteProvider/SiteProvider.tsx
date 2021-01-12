import * as React from 'react';
import { SiteFragment } from 'services/site/model/SiteFragment';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { fetchSiteProvider } from 'services/site/actions';
import { useEffect } from 'react';
import { BeatLoader } from 'react-spinners';

interface SiteProviderProps {
  id?: number;
  url?: string;
  children: any; // (site: SiteFragment) => JSX.Element | null;
}
interface UseSiteProps {
  id?: number | any;
  url?: string | any;
}

function SiteProvider(props: SiteProviderProps) {
  const dispatch = useDispatch();
  useEffect(() => {
  dispatch(fetchSiteProvider(props?.id, props?.url));
 }, [])
  
 const urlName = new URLSearchParams(window.location.search)
 .getAll('sv')
 .toString()
 .toLowerCase();
  //console.log("🚀 ~ urlName", urlName);
  
 const isFetchingSiteProvider = useSelector((state : RootState) => state.site.isFetchingSiteProvider)
 const siteProvider = useSelector((state : RootState ) => state.site.siteProvider)
 //console.log("🚀 ~useSite ~ siteProvider", siteProvider);

 //const result = siteProvider
 //if (!result) return { ...result, site: null, currentSiteView: null };
if (!siteProvider){
  return <BeatLoader/>
}
if (!isFetchingSiteProvider  ) {
  const site = siteProvider.site;
  const currentSiteView =
  site?.siteViews.find(
    siteview => siteview?.url?.toLowerCase() === urlName
    ) || site?.siteView;
  //console.log("🚀 ~ file:   CURRENT SITE VIEW *", currentSiteView);

  return props.children(site, currentSiteView);
}
else {
  return <BeatLoader/>
}
}

export default SiteProvider;