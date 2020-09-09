import * as React from 'react';
import {
    useQuery,
} from 'react-apollo';
import { gql } from 'apollo-boost';
import {
    PresentSiteProviderQuery,
} from 'types/PresentSiteProviderQuery';
import { SiteFragment } from 'types/SiteFragment';
import useUrlParams from "../../utils/UrlParamsProvider";


interface PresentSiteProviderProps {
    id?: number;
    url?: string;
    children: (site: SiteFragment, refetch: any) => JSX.Element | null;
}

const SITE_STUDY_EXTENDED_GENERIC_SECTION_FRAGMENT = gql`
    fragment SiteStudyExtendedGenericSectionFragment on SiteStudyExtendedGenericSection {
        template
        hide
        order
        title
        name
    }
`;

const SITE_STUDY_BASIC_GENERIC_SECTION_FRAGMENT = gql`
    fragment SiteStudyBasicGenericSectionFragment on SiteStudyBasicGenericSection {
        hide
        title
        name
    }
`;

const SITE_STUDY_PAGE_FRAGMENT = gql`
    fragment SiteStudyPageFragment on SiteStudyPage {
        allFields
        basicSections {
            ...SiteStudyBasicGenericSectionFragment
        }
        extendedSections {
            ...SiteStudyExtendedGenericSectionFragment
        }
    }

    ${SITE_STUDY_BASIC_GENERIC_SECTION_FRAGMENT}
    ${SITE_STUDY_EXTENDED_GENERIC_SECTION_FRAGMENT}
`;

export const SITE_VIEW_FRAGMENT = gql`
    fragment SiteViewFragment on SiteView {
        name
        url
        id
        default
        description
        study {
            ...SiteStudyPageFragment
        }
        search {
            type
            template
            autoSuggest {
                aggs {
                    fields {
                        order {
                            sortKind
                            desc
                        }
                        name
                        display
                        preselected {
                            kind
                            values
                        }
                        visibleOptions {
                            kind
                            values
                        }
                        autoSuggest
                        rank
                    }
                    selected {
                        kind
                        values
                    }
                }
                crowdAggs {
                    fields {
                        order {
                            sortKind
                            desc
                        }
                        name
                        display
                        preselected {
                            kind
                            values
                        }
                        visibleOptions {
                            kind
                            values
                        }
                        rank
                        autoSuggest
                    }
                    selected {
                        kind
                        values
                    }
                }
            }
            results {
                type
                buttons {
                    items {
                        icon
                        target
                    }
                    location
                }
            }
            presearch {
                aggs {
                    fields {
                        order {
                            sortKind
                            desc
                        }
                        name
                        display
                        displayName
                        preselected {
                            kind
                            values
                        }
                        visibleOptions {
                            kind
                            values
                        }
                        autoSuggest
                        rank
                        rangeStartLabel
                        rangeEndLabel
                    }
                    selected {
                        kind
                        values
                    }
                }
                crowdAggs {
                    fields {
                        order {
                            sortKind
                            desc
                        }
                        name
                        display
                        displayName
                        preselected {
                            kind
                            values
                        }
                        visibleOptions {
                            kind
                            values
                        }
                        rank
                        autoSuggest
                        rangeStartLabel
                        rangeEndLabel
                    }
                    selected {
                        kind
                        values
                    }
                }
                button {
                    name
                    target
                }
                instructions
            }
            sortables
            fields
            config {
                fields {
                    showPresearch
                    showFacetBar
                    showAutoSuggest
                    showBreadCrumbs
                    showResults
                }
            }

            aggs {
                fields {
                    order {
                        sortKind
                        desc
                    }
                    name
                    display
                    displayName
                    preselected {
                        kind
                        values
                    }
                    visibleOptions {
                        kind
                        values
                    }
                    autoSuggest
                    rank
                    rangeStartLabel
                    rangeEndLabel
                }
                selected {
                    kind
                    values
                }
            }
            crowdAggs {
                fields {
                    order {
                        sortKind
                        desc
                    }
                    name
                    display
                    displayName
                    preselected {
                        kind
                        values
                    }
                    visibleOptions {
                        kind
                        values
                    }
                    rank
                    autoSuggest
                    rangeStartLabel
                    rangeEndLabel
                }
                selected {
                    kind
                    values
                }
            }
        }
    }

    ${SITE_STUDY_PAGE_FRAGMENT}
`;


/*export const PAGE_VIEW_FRAGMENT = gql`
    fragment PageViewFragment on PageView {
        id
        url
        title
        default
        template
        pageType
    }
`;*/

export const SITE_FRAGMENT = gql`
    fragment SiteFragment on Site {
        id
        editors {
            email
        }
        name
        skipLanding
        subdomain
        themes
        reactionsConfig
        userRank
        owners {
            email
        }
        siteView(url: $url) {
            ...SiteViewFragment
        }
#        pageView{
#            ...PageViewFragment
#        }
    }

    ${SITE_VIEW_FRAGMENT}

    
    
    
`;

const QUERY = gql`
    query PresentSiteProviderQuery($id: Int, $url: String) {
        site(id: $id) {
            ...SiteFragment
        }
    }

    ${SITE_FRAGMENT}
`;








interface UsePresentSiteProps {
    id?: number;
    url?: string;
}

export function usePresentSite(props?: UsePresentSiteProps) {
    console.log("USE Present Site PROPS", props);
    console.trace();
  /*  const urlName = new URLSearchParams(window.location.search)
        .getAll('sv')
        .toString()
        .toLowerCase();*/
    const result = useQuery<PresentSiteProviderQuery>(QUERY, {
        variables: { id: props?.id, url: props?.url },
    });
    if (!result.data) return { ...result, site: null, presentSiteView: null };
    const site = result?.data?.site;
    const presentSiteView = site?.siteView;

      /*      .find(
            siteview => siteview?.url?.toLowerCase() === urlName
        ) || site?.siteView;*/

    return { ...result, site, presentSiteView };
}


function PresentSiteProvider(props: PresentSiteProviderProps) {
    const { data, loading, error, refetch } = usePresentSite(props);
    if (error) console.log(error);
    if (loading || error || !data) return null;
    return props.children(data.site!, refetch);
}

export default PresentSiteProvider;


/*
const params = useUrlParams();
const { site } = usePresentSite({ url: params.sv});
*/
