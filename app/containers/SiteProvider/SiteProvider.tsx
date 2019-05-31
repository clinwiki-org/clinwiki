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

const SITE_VIEW_FRAGMENT = gql`
  fragment SiteViewFragment on SiteView {
    id
    workflow {
      addRating
    }
    search {
      aggs {
        fields {
          name
          display
          preselected {
            kind
            values
          }
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
          rank
        }
        selected {
          kind
          values
        }
      }
    }
  }
`;

const SITE_FRAGMENT = gql`
  fragment SiteFragment on Site {
    id
    editors {
      email
    }
    name
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
