import * as React from 'react';
import { Query } from 'react-apollo';
import { Table } from 'react-bootstrap';
import { gql } from 'apollo-boost';
import {
  InterventionsPageQuery,
  InterventionsPageQueryVariables,
} from 'types/InterventionsPageQuery';
import { History } from 'history';
import { match } from 'react-router-dom';

import InterventionItem from './InterventionItem';
import StudySummary from 'components/StudySummary';
import { SiteStudyBasicGenericSectionFragment } from 'types/SiteStudyBasicGenericSectionFragment';
import { SiteStudyExtendedGenericSectionFragment } from 'types/SiteStudyExtendedGenericSectionFragment';
import { prop } from 'ramda';
import { displayFields } from 'utils/siteViewHelpers';

const QUERY = gql`
  query InterventionsPageQuery($nctId: String!) {
    study(nctId: $nctId) {
      ...StudySummaryFragment
      interventions {
        ...InterventionItemFragment
      }
    }
  }

  ${InterventionItem.fragment}
  ${StudySummary.fragment}
`;

interface InterventionsPageProps {
  history: History;
  match: match<{ nctId: string }>;
  onLoaded?: () => void;
  isWorkflow?: boolean;
  nextLink?: string | null;
  metaData: SiteStudyExtendedGenericSectionFragment;
}

class QueryComponent extends Query<
  InterventionsPageQuery,
  InterventionsPageQueryVariables
> {}

class InterventionsPage extends React.PureComponent<InterventionsPageProps> {
  static fragment = InterventionItem.fragment;

  handleItemClick = (id: number) => {
    this.props.history.push(`/intervention/${id}`);
  };

  render() {
    return (
      <QueryComponent
        query={QUERY}
        variables={{ nctId: this.props.match.params.nctId }}
      >
        {({ data, loading, error }) => {
          if (loading || error || !data || !data.study) return null;
          this.props.onLoaded && this.props.onLoaded();

          const fields = displayFields(
            this.props.metaData.selected.kind,
            this.props.metaData.selected.values,
            this.props.metaData.fields.map(name => ({ name, rank: null })),
          ).map(prop('name'));

          return (
            <div>
              <Table striped>
                <thead>
                  <tr>
                    {fields.includes('name') && (
                      <th style={{ width: '25%' }}>Name</th>
                    )}
                    {fields.includes('type') && (
                      <th style={{ width: '25%' }}>Kind</th>
                    )}
                    {fields.includes('description') && (
                      <th style={{ width: '50%' }}>Description</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {data.study.interventions.map(intervention => (
                    <InterventionItem
                      fields={fields}
                      key={intervention.id}
                      interventionItem={intervention}
                      onClick={this.handleItemClick}
                    />
                  ))}
                </tbody>
              </Table>
            </div>
          );
        }}
      </QueryComponent>
    );
  }
}

export default InterventionsPage;
