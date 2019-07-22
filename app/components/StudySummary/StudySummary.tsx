import * as React from 'react';
import styled from 'styled-components';
import { Table } from 'react-bootstrap';
import { gql } from 'apollo-boost';
import { StudySummaryFragment } from 'types/StudySummaryFragment';
import { Helmet } from 'react-helmet';
import CollapsiblePanel from 'components/CollapsiblePanel';
import { WorkflowsViewFragment } from 'types/WorkflowsViewFragment';
import { displayFields } from 'utils/siteViewHelpers';
import { WorkflowConfigFragment } from 'types/WorkflowConfigFragment';
import { prop } from 'ramda';

interface StudySummaryProps {
  study: StudySummaryFragment;
  workflow: WorkflowConfigFragment | null;
  workflowsView: WorkflowsViewFragment;
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
    let allowedFields = this.props.workflowsView.workflows[0].allSummaryFields;
    if (this.props.workflow) {
      allowedFields = displayFields(
        this.props.workflow.summaryFieldsFilter.kind,
        this.props.workflow.summaryFieldsFilter.values,
        this.props.workflow.allSummaryFields.map(name => ({
          name,
          rank: null,
        })),
      ).map(prop('name'));
    }

    return (
      <div className="container">
        <Helmet>
          <title>{`Wiki - ${this.props.study.briefTitle}`}</title>
        </Helmet>

        <CollapsiblePanel header={this.props.study.briefTitle || ''}>
          <Table striped bordered condensed>
            <tbody>
              {allowedFields.includes('nct_id') && (
                <tr>
                  <th>NCT ID</th>
                  <td>{this.props.study.nctId}</td>
                </tr>
              )}
              {allowedFields.includes('type') && (
                <tr>
                  <th>Type</th>
                  <td>{this.props.study.type}</td>
                </tr>
              )}
              {allowedFields.includes('status') && (
                <tr>
                  <th>Status</th>
                  <td>{this.props.study.overallStatus}</td>
                </tr>
              )}
              {allowedFields.includes('completion_date') && (
                <tr>
                  <th>Primary Completion Date</th>
                  <td>{this.props.study.completionDate}</td>
                </tr>
              )}
              {allowedFields.includes('enrollment') && (
                <tr>
                  <th>Enrollment</th>
                  <td>{this.props.study.enrollment}</td>
                </tr>
              )}
              {allowedFields.includes('source') && (
                <tr>
                  <th>Source</th>
                  <td>{this.props.study.source}</td>
                </tr>
              )}
            </tbody>
          </Table>
        </CollapsiblePanel>
      </div>
    );
  }
}

export default StudySummary;
