import * as React from 'react';
import { PresentSiteFragment } from  'services/site/model/PresentSiteFragment';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchPresentSiteProvider } from 'services/site/actions';
import { RootState } from 'reducers';
import { BeatLoader } from 'react-spinners';

interface PresentSiteProviderProps {
    id?: number;
    url?: string;
    children: (site: PresentSiteFragment) => JSX.Element | null;
}


function PresentSiteProvider(props: PresentSiteProviderProps) {
    const url =
    window.location.search;
    const urlName = new URLSearchParams(url)
    .getAll('sv')
    .toString();
    const urlFinal = urlName ? urlName : "default";

    const dispatch = useDispatch();
    useEffect(() => {
    dispatch(fetchPresentSiteProvider( props?.id ,  urlFinal));
   }, [])

   const isFetchingPresentSiteProvider = useSelector((state : RootState) => state.site.isFetchingPresentSiteProvider)
   const presentSiteProvider = useSelector((state : RootState ) => state.site.presentSiteProvider)

   if (!presentSiteProvider){
    return <BeatLoader/>
  }
  if (!isFetchingPresentSiteProvider  ) {
    const site = presentSiteProvider.site;
    return props.children(site);
  }
  else {
    return <BeatLoader/>
  }
  
}

type ToOmit = 'site' | 'refetch' | 'presentSiteView' | 'prevParams';
export function withPresentSite2<T>(
    Component: React.ComponentType<T>
    ): React.ComponentClass<Omit<T, ToOmit>> {
        class WithPresentSiteProvider extends React.Component<Omit<T, ToOmit>> {
            
            render() {
                return (
                    <PresentSiteProvider>
                    {( site) => {
                        const presentSite = site.siteView;
                        return (
                            <Component
                            {...(this.props as T)}
                            site={site}
                            //refetch={refetch}
                            presentSiteView={presentSite}
                            />
                            );
                        }}
                </PresentSiteProvider>
            );
        }
    }
    return WithPresentSiteProvider;
}

export default PresentSiteProvider;

/*
interface UsePresentSiteProps {
    id?: number;
    url?: string;
}
 export function usePresentSite(props?: UsePresentSiteProps) {
    const result = useQuery<PresentSiteProviderQuery>(PRESENT_SITE_PROVIDER_QUERY, {
        variables: { id: props?.id, url: props?.url },
    });
    if (!result.data) return { ...result, site: null, presentSiteView: null };
    const site = result?.data?.site;
    const presentSiteView = site?.siteView;
    return { ...result, site, presentSiteView };
} */




 /* const url =
        window.location.search;
    const urlName = new URLSearchParams(url)
        .getAll('sv')
        .toString();
    const urlFinal = urlName ? urlName : "default";

    const { data, loading, error, refetch } = usePresentSite({url: urlFinal});
   
    if (error) console.log(error);
    if (loading || error || !data) return null;
    return props.children(data.site!, refetch);
  */  
