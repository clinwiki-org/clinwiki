import * as React from 'react';
import { SiteFragment } from 'services/site/model/SiteFragment';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { fetchSiteProvider } from 'services/site/actions';
import { useEffect } from 'react';


interface SiteProviderProps {
  id?: number;
  url?: string;
  children: (site: SiteFragment, refetch: any) => JSX.Element | null;
}


interface UseSiteProps {
  id?: number | any;
  url?: string | any;
}
export function useSite(props?: UseSiteProps) {

  const dispatch = useDispatch();
  const siteProvider = useSelector((state : RootState ) => state.site.siteProvider)
  const isFetchingSiteProvider = useSelector((state : RootState) => state.site.isFetchingSiteProvider)

  // console.log("USE SITE PROPS", props);
  // console.trace();
  const urlName = new URLSearchParams(window.location.search)
    .getAll('sv')
    .toString()
    .toLowerCase();

    dispatch(fetchSiteProvider(props?.id, props?.url));

  const result = siteProvider

  //TODO replace with useSelector to check results /data and pull site

  if (!result) return { ...result, site: null, currentSiteView: null };
  if (!isFetchingSiteProvider && result.siteProvider ) {
    const site = siteProvider;
    const currentSiteView =
      site?.siteViews.find(
        siteview => siteview?.url?.toLowerCase() === urlName
      ) || site?.siteView;
    return { ...result, site, currentSiteView };
  }
}

function SiteProvider(props: SiteProviderProps) {

 // useEffect( () => {
    useSite(props);  //TODO CHECK this
 // }, []);


  const refetch = null //() => console.log("REFETCH"); //TODO CHECK this
  const data = useSelector((state : RootState ) => state.site.siteProvider)
  const loading = useSelector((state : RootState) => state.site.isFetchingSiteProvider)

  //if (error) console.log(error);
  if (loading || !data) return null;
  return props.children(data.site!, refetch);
}

export default SiteProvider;
