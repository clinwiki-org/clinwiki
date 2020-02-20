import * as React from 'react';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import {
  SiteProviderQuery,
  SiteProviderQueryVariables,
} from 'types/SiteProviderQuery';
import { SiteFragment } from 'types/SiteFragment';

interface SiteProviderProps {
  id?: number;
  url?: string;
  children: (site: SiteFragment, refetch: any) => React.ReactNode;
}

const SITE_STUDY_EXTENDED_GENERIC_SECTION_FRAGMENT = gql`
  fragment SiteStudyExtendedGenericSectionFragment on SiteStudyExtendedGenericSection {
    fields
    hide
    order
    selected {
      kind
      values
    }
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

const SITE_VIEW_FRAGMENT = gql`
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
      autoSuggest{
        fields
      }
      breadCrumbs{
        icon
        target
        location
      }
      presearch{
        aggs {
          fields {
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
        button{
          name
          url
        }
      }


      fields
      config{
        fields{
          showPresearch
          showFacetBar
          showAutoSuggest
          showBreadCrumbs
          showResults
        }
      }


      aggs {
        fields {
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
  }

  ${SITE_STUDY_PAGE_FRAGMENT}
`;

const SITE_FRAGMENT = gql`
  fragment SiteFragment on Site {
    id
    editors {
      email
    }
    name
    skipLanding
    subdomain
    owners {
      email
    }
    siteView(url: $url) {
      ...SiteViewFragment
    }
    siteViews {
      ...SiteViewFragment
    }
  }

  ${SITE_VIEW_FRAGMENT}
`;

const QUERY = gql`
  query SiteProviderQuery($id: Int, $url: String) {
    site(id: $id) {
      ...SiteFragment
    }
  }

  ${SITE_FRAGMENT}
`;

class QueryComponent extends Query<
  SiteProviderQuery,
  SiteProviderQueryVariables
> {}

class SiteProvider extends React.PureComponent<SiteProviderProps> {
  static fragment = SITE_FRAGMENT;
  static siteViewFragment = SITE_VIEW_FRAGMENT;

  render() {
    return (
      <QueryComponent query={QUERY} variables={{ id: this.props.id }}>
        {({ data, loading, error, refetch }) => {
          if (loading || error) return null;
           console.log(data);
          return this.props.children(data!.site!, refetch);
        }}
      </QueryComponent>
    );
  }
}

export default SiteProvider;
