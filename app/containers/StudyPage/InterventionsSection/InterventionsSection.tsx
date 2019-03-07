import * as React from 'react';
import { Query } from 'react-apollo';
import { Table } from 'react-bootstrap';
import { gql } from 'apollo-boost';
import {
  InterventionsSectionQuery,
  InterventionsSectionQueryVariables,
} from 'types/InterventionsSectionQuery';

import InterventionItem from './InterventionItem';

const QUERY = gql`
  query InterventionsSectionQuery($nctId: String!) {
    study(nctId: $nctId) {
      interventions {
        ...InterventionItemFragment
      }
    }
  }

  ${InterventionItem.fragment}
`;

interface InterventionsSectionProps {
  history: any;
  nctId: string;
  loggedIn: boolean;
}

class QueryComponent extends Query<InterventionsSectionQuery, InterventionsSectionQueryVariables> {}

class InterventionsSection extends React.PureComponent<InterventionsSectionProps> {
  handleItemClick = (id: number) => {
    this.props.history.push(`/intervention/${id}`);
  }

  render() {
    return (
      <QueryComponent query={QUERY} variables={{ nctId: this.props.nctId }}>
      {({ data, loading, error }) => {
        if (loading || error || !data || !data.study) return null;
        return (
          <div className="container">
            <h1>Interventions</h1>
            <Table striped>
              <thead>
                <tr>
                  <th style={{ width: '25%' }}>Name</th>
                  <th style={{ width: '25%' }}>Kind</th>
                  <th style={{ width: '50%' }}>Description</th>
                </tr>
              </thead>
              <tbody>
                {data.study.interventions.map(intervention =>
                  <InterventionItem
                    key={intervention.id}
                    interventionItem={intervention}
                    onClick={this.handleItemClick}
                  />,
                )}
              </tbody>
            </Table>
          </div>
        );
      }}
      </QueryComponent>
    );
  }
}

export default InterventionsSection;
