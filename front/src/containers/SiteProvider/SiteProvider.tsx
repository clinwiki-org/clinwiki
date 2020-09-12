import * as React from 'react';
import {
  useQuery,
} from 'react-apollo';
import { gql } from 'apollo-boost';
import {
  SiteProviderQuery,
} from 'types/SiteProviderQuery';
import { SiteFragment } from 'types/SiteFragment';

interface SiteProviderProps {
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
      crumbs {
        search
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


export const PAGE_VIEW_FRAGMENT = gql`
  fragment PageViewFragment on PageView {
    id
    url
    title
    default
    template
    pageType
  }
`;
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
    siteViews {
      ...SiteViewFragment
    }
    pageView{
      ...PageViewFragment
    }
  }

  ${SITE_VIEW_FRAGMENT}
  ${PAGE_VIEW_FRAGMENT}
`;

const QUERY = gql`
  query SiteProviderQuery($id: Int, $url: String) {
    site(id: $id) {
      ...SiteFragment
    }
  }

  ${SITE_FRAGMENT}
`;

type ToOmit = 'site' | 'refetch' | 'currentSiteView';
export function withSite2<T>(
  Component: React.ComponentType<T>
): React.ComponentClass<Omit<T, ToOmit>> {
  class WithSiteProvider extends React.Component<Omit<T, ToOmit>> {
    render() {
      return (
        <SiteProvider>
          {(site, refetch) => {
            const url =
              (this.props as any)?.history?.location?.search ||
              window.location.search;
            const urlName = new URLSearchParams(url)
              .getAll('sv')
              .toString()
              .toLowerCase();
            const currentSite =
              site.siteViews.find(
                siteview => siteview?.url?.toLowerCase() === urlName
              ) || site.siteView;
            return (
              <Component
                {...(this.props as T)}
                site={site}
                refetch={refetch}
                currentSiteView={currentSite}
              />
            );
          }}
        </SiteProvider>
      );
    }
  }
  return WithSiteProvider;
}

export const withSite = Component => props => (
  <SiteProvider>
    {(site, refetch) => {
      const siteViewUrl = () => {
        if (props.history) {
          return new URLSearchParams(props?.history?.location?.search)
            .getAll('sv')
            .toString()
            .toLowerCase();
        }
        return props.currentSiteView.url.toLowerCase();
      };
      // const siteViewUrl = props?.match?.params?.siteviewUrl?.toLowerCase();
      // console.log(`withSite: ${siteViewUrl}`);
      const siteViews = site.siteViews;
      const currentSite =
        siteViews.find(
          siteview => siteview?.url?.toLowerCase() === siteViewUrl()
        ) || site.siteView;
      return (
        <Component
          {...props}
          site={site}
          refetch={refetch}
          currentSiteView={currentSite}
        />
      );
    }}
  </SiteProvider>
);

interface UseSiteProps {
  id?: number;
  url?: string;
}
export function useSite(props?: UseSiteProps) {
  const urlName = new URLSearchParams(window.location.search)
    .getAll('sv')
    .toString()
    .toLowerCase();
  const result = useQuery<SiteProviderQuery>(QUERY, {
    variables: { id: props?.id, url: props?.url },
  });
  if (!result.data) return { ...result, site: null, currentSiteView: null };
  const site = result?.data?.site;
  const currentSiteView =
    site?.siteViews.find(
      siteview => siteview?.url?.toLowerCase() === urlName
    ) || site?.siteView;

  return { ...result, site, currentSiteView };
}

function SiteProvider(props: SiteProviderProps) {
  const { data, loading, error, refetch } = useSite(props);
  if (error) console.log(error);
  if (loading || error || !data) return null;
  return props.children(data.site!, refetch);
}

export default SiteProvider;
