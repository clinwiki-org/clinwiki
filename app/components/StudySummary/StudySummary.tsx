import * as React from 'react';
import styled from 'styled-components';
import { Table } from 'react-bootstrap';
import { gql } from 'apollo-boost';
import { StudySummaryFragment } from 'types/StudySummaryFragment';
import { Helmet } from 'react-helmet';
import CollapsiblePanel from 'components/CollapsiblePanel';

interface StudySummaryProps {
  study: StudySummaryFragment;
}

class StudySummary extends React.PureComponent<StudySummaryProps> {
  static fragment = gql`
    fragment StudySummaryFragment on Study {
      briefTitle
      nctId
      type
      overallStatus
      completionDate
      enrollment
      source
      reviewsCount
      averageRating
    }
  `;

  render() {
    return (
      <div className="container">
        <Helmet>
          <title>{`Wiki - ${this.props.study.briefTitle}`}</title>
        </Helmet>

        <CollapsiblePanel header={this.props.study.briefTitle || ''}>
          <Table striped bordered condensed>
            <tbody>
              <tr>
                <th>NCT ID</th>
                <td>{this.props.study.nctId}</td>
              </tr>
              <tr>
                <th>Type</th>
                <td>{this.props.study.type}</td>
              </tr>
              <tr>
                <th>Status</th>
                <td>{this.props.study.overallStatus}</td>
              </tr>
              <tr>
                <th>Primary Completion Date</th>
                <td>{this.props.study.completionDate}</td>
              </tr>
              <tr>
                <th>Enrollment</th>
                <td>{this.props.study.enrollment}</td>
              </tr>
              <tr>
                <th>Source</th>
                <td>{this.props.study.source}</td>
              </tr>
            </tbody>
          </Table>
        </CollapsiblePanel>
      </div>
    );
  }
}

export default StudySummary;
