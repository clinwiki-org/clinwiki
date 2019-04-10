import * as React from 'react';
import styled from 'styled-components';
import { Table, Panel, Grid } from 'react-bootstrap';
import * as FontAwesome from 'react-fontawesome';
import { Transition } from 'react-transition-group';
import { gql } from 'apollo-boost';
import { StudySummaryFragment } from 'types/StudySummaryFragment';
import { Helmet } from 'react-helmet';

interface StudySummaryProps {
  study: StudySummaryFragment;
}

interface StudySummaryState {
  summaryVisible: boolean;
}

const StyleWrapper = styled.div`
  .panel-heading {
    cursor: pointer;
  }
  .panel-toggle {
    margin-top: 4px;
    font-weight: bold;
  }
`;

const StyledPanelBody = styled.div`
  transition: all 0.2s ease-in;
  overflow: hidden;
  ${(props: { status: string }) => {
    switch (props.status) {
      case 'exited':
        return `
          max-height: 0;
          padding: 0;
        `;
      case 'exiting':
        return `
          max-height: 0;
          padding: 0;
        `;
      case 'entering':
        return `
          max-height: 250px;
        `;
      case 'entered':
        return `
          max-height: 250px;
        `;
    }
    return '';
  }}
`;

class StudySummary extends React.Component<
  StudySummaryProps,
  StudySummaryState
> {
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

  state: StudySummaryState = {
    summaryVisible: true,
  };

  render() {
    return (
      <Grid>
        <StyleWrapper>
          <Helmet>
            <title>{`Wiki - ${this.props.study.briefTitle}`}</title>
          </Helmet>

          <Panel>
            <Panel.Heading
              onClick={() =>
                this.setState({ summaryVisible: !this.state.summaryVisible })
              }
              title={
                this.state.summaryVisible
                  ? 'Click to hide details'
                  : 'Click to show details'
              }
            >
              <Panel.Title componentClass="h3" className="pull-left">
                {this.props.study.briefTitle}
              </Panel.Title>
              <FontAwesome
                name={
                  this.state.summaryVisible
                    ? 'angle-double-up'
                    : 'angle-double-down'
                }
                className="pull-right panel-toggle"
              />
              &nbsp;
            </Panel.Heading>
            <Transition in={this.state.summaryVisible} timeout={200}>
              {status => (
                <StyledPanelBody status={status}>
                  <Panel.Body>
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
                  </Panel.Body>
                </StyledPanelBody>
              )}
            </Transition>
          </Panel>
        </StyleWrapper>
      </Grid>
    );
  }
}

export default StudySummary;
