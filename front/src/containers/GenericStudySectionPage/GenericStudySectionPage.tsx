import * as React from 'react';
import { Table } from 'react-bootstrap';
import { Query, QueryComponentOptions } from 'react-apollo';
import { gql } from 'apollo-boost';
import { match } from 'react-router-dom';
import { History } from 'history';
import {
  GenericStudySectionPageQuery,
  GenericStudySectionPageQueryVariables,
} from 'types/GenericStudySectionPageQuery';
import StudySummary from 'components/StudySummary';
import { SiteStudyExtendedGenericSectionFragment } from 'types/SiteStudyExtendedGenericSectionFragment';
import { MailMergeView } from 'components/MailMerge';

interface GenericStudySectionPageProps {
  nctId: string;
  history: History;
  match: match<{ nctId: string }>;
  onLoaded?: () => void;
  isWorkflow?: boolean;
  nextLink?: string | null;
  metaData: SiteStudyExtendedGenericSectionFragment;
}

const QUERY = gql`
  query GenericStudySectionPageQuery($nctId: String!) {
    study(nctId: $nctId) {
      ...StudySummaryFragment
    }
    me {
      id
    }
  }

  ${StudySummary.fragment}
`;

const QueryComponent = (
  props: QueryComponentOptions<
    GenericStudySectionPageQuery,
    GenericStudySectionPageQueryVariables
  >
) => Query(props);

class GenericStudySectionPage extends React.PureComponent<
  GenericStudySectionPageProps
> {
  render() {
    return (
      <QueryComponent query={QUERY} variables={{ nctId: this.props.nctId }}>
        {({ data, loading, error }) => {
          if (loading || error || !data || !data.study) {
            return null;
          }

          this.props.onLoaded && this.props.onLoaded();
          return (
            <MailMergeView
              template={this.props.metaData.template || ''}
              context={data.study}
            />
          );
        }}
      </QueryComponent>
    );
  }
}

export default GenericStudySectionPage;
