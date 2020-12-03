import * as React from 'react';
import { useQuery } from '@apollo/client';
import { gql }  from '@apollo/client';
import {
    PresentSiteProviderQuery,
    PresentSiteProviderQueryVariables
} from 'types/PresentSiteProviderQuery';
import { PresentSiteFragment } from 'types/PresentSiteFragment';
import PRESENT_SITE_QUERY from 'queries/PresentSiteProviderQuery'

interface PresentSiteProviderProps {
    //usePresentSite?(id?: number, url?: string): any;
    id?: number;
    url?: string;
    children: (site: PresentSiteFragment, refetch: any) => JSX.Element | null;
}



type ToOmit = 'site' | 'refetch' | 'presentSiteView' | 'prevParams';
export function withPresentSite2<T>(
    Component: React.ComponentType<T>
): React.ComponentClass<Omit<T, ToOmit>> {
    class WithPresentSiteProvider extends React.Component<Omit<T, ToOmit>> {
    
        render() {
            return (
                <PresentSiteProvider>
                    {( site, refetch) => {
                        const presentSite = site.siteView;
                        return (
                            <Component
                                {...(this.props as T)}
                                site={site}
                                refetch={refetch}
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

interface UsePresentSiteProps {
    id?: number;
    url?: string;
}

export function usePresentSite(props?: UsePresentSiteProps) {
    const result = useQuery<PresentSiteProviderQuery>(PRESENT_SITE_QUERY, {
        variables: { id: props?.id, url: props?.url },
    });
    console.log('RESULT from Present Site Provider')
    if (!result.data) return { ...result, site: null, presentSiteView: null };
    const site = result?.data?.site;
    const presentSiteView = site?.siteView;
    return { ...result, site, presentSiteView };
}

function PresentSiteProvider(props: PresentSiteProviderProps) {
    const url =
        window.location.search;
    const urlName = new URLSearchParams(url)
        .getAll('sv')
        .toString();
    const urlFinal = urlName ? urlName : "default";

    const { data, loading, error, refetch } = usePresentSite({url: urlFinal});
   
    if (error) console.log(error);
    if (loading || error || !data) return null;
    return props.children(data.site!, refetch);
}

export default PresentSiteProvider;
