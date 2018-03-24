import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Table, Panel, Grid } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import { Transition } from 'react-transition-group';

const InfoWrapper = styled.div`
  .panel-heading {
    cursor: pointer;
  }
  .panel-toggle {
    margin-top: 4px;
    font-weight: bold;
  }
  .fade {
    opacity: 0;
    -webkit-transition: opacity 0.05s linear;
    -moz-transition: opacity 0.05s linear;
    -o-transition: opacity 0.05s linear;
    transition: opacity 0.05s linear;
  }
  .fade.in {
    opacity: 1;
  }
`;

class SummaryInfo extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.state = {
      summaryVisible: true,
    };
  }

  render() {
    if (!this.props.study) {
      return <div></div>;
    }
    return (
      <Grid>
        <InfoWrapper>
          <Panel>
            <Panel.Heading
              onClick={() => this.setState({ summaryVisible: !this.state.summaryVisible })}
              title={this.state.summaryVisible ? 'Click to hide details' : 'Click to show details'}
            >
              <Panel.Title componentClass="h3" className="pull-left">
                {this.props.study.title}
              </Panel.Title>
              <FontAwesome
                name={this.state.summaryVisible ? 'angle-double-up' : 'angle-double-down'}
                className="pull-right panel-toggle"
              />
              &nbsp;
            </Panel.Heading>
            <Transition
              in={this.state.summaryVisible}
              className="fade"
              timeout={200}
            >
              {(status) => (
                <Panel.Body
                  className={{
                    exiting: 'fade',
                    exited: 'hidden fade',
                    entering: 'fade in',
                    entered: '',
                  }[status]}
                >
                  <Table striped bordered condensed>
                    <tbody>
                      <tr>
                        <th>NCT ID</th>
                        <td>{this.props.study.nct_id}</td>
                      </tr>
                      <tr>
                        <th>Type</th>
                        <td>{this.props.study.study_type}</td>
                      </tr>
                      <tr>
                        <th>Status</th>
                        <td>{this.props.study.overall_status}</td>
                      </tr>
                      <tr>
                        <th>Primary Completion Date</th>
                        <td>{this.props.study.primary_completion_date}</td>
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
              )}
            </Transition>
          </Panel>
        </InfoWrapper>
      </Grid>
    );
  }
}

SummaryInfo.propTypes = {
  study: PropTypes.object,
};

export default SummaryInfo;
