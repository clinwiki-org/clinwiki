import * as React from 'react';
import { Query, QueryComponentOptions } from '@apollo/client/react/components';
import { Table } from 'react-bootstrap';
import { gql }  from '@apollo/client';
import {
  InterventionsPageQuery,
  InterventionsPageQueryVariables,
} from 'types/InterventionsPageQuery';
import { History, Location } from 'history';
import { match } from 'react-router-dom';
import InterventionItem from './InterventionItem';
import StudySummary from 'components/StudySummary';
import { SiteStudyExtendedGenericSectionFragment } from 'services/study/model/SiteStudyExtendedGenericSectionFragment';

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
  location: Location;
}

const QueryComponent = (
  props: QueryComponentOptions<
    InterventionsPageQuery,
    InterventionsPageQueryVariables
  >
) => Query(props);

class InterventionsPage extends React.PureComponent<InterventionsPageProps> {
  static fragment = InterventionItem.fragment;

  handleItemClick = (id: number) => {
    this.props.history.push(`/intervention/${id}?sv=intervention`);
  };

  render() {
    return (
      <QueryComponent
        query={QUERY}
        variables={{ nctId: this.props.match.params.nctId }}>
        {({ data, loading, error }) => {
          if (loading || error || !data || !data.study) return null;
          this.props.onLoaded && this.props.onLoaded();

          return (
            <div>
              <Table striped>
                <thead>
                  <tr>
                    <th style={{ width: '25%' }}>Name</th>
                    <th style={{ width: '25%' }}>Kind</th>
                    <th style={{ width: '50%' }}>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {data.study.interventions.map(intervention => (
                    <InterventionItem
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
