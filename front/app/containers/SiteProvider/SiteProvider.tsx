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
  children: (site: SiteFragment) => React.ReactNode;
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
    id
    study {
      ...SiteStudyPageFragment
    }
    search {
      fields
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
    siteView {
      ...SiteViewFragment
    }
  }

  ${SITE_VIEW_FRAGMENT}
`;

const QUERY = gql`
  query SiteProviderQuery($id: Int) {
    site(id: $id) {
      ...SiteFragment
    }
  }

  ${SITE_FRAGMENT}
`;

export const withSite = Component => props => (
  <SiteProvider>{site => <Component {...props} site={site} />}</SiteProvider>
);

class QueryComponent extends Query<
  SiteProviderQuery,
  SiteProviderQueryVariables
> {}

class SiteProvider extends React.PureComponent<SiteProviderProps> {
  static fragment = SITE_FRAGMENT;
  static siteViewFragmemt = SITE_VIEW_FRAGMENT;

  render() {
    return (
      <QueryComponent query={QUERY} variables={{ id: this.props.id }}>
        {({ data, loading, error }) => {
          if (loading || error) return null;
          return this.props.children(data!.site!);
        }}
      </QueryComponent>
    );
  }
}

export default SiteProvider;
