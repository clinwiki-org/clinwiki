import * as React from 'react';
import styled from 'styled-components';
import { Row, Col, Checkbox } from 'react-bootstrap';
import { StyledContainer, StyledFormControl, StyledLabel } from './Styled';
import { SiteViewFragment } from 'types/SiteViewFragment';

interface WorkflowFormProps {
  view: SiteViewFragment;
  onAddMutation: (e: { currentTarget: { name: string; value: any } }) => void;
}

class WorkflowForm extends React.PureComponent<WorkflowFormProps> {
  handleCheckboxChange = e => {
    this.props.onAddMutation({
      currentTarget: {
        name: e.currentTarget.name,
        value: e.currentTarget.checked,
      },
    });
  };

  render() {
    const view = this.props.view;

    return (
      <StyledContainer>
        <Row>
          <Col md={6}>
            <StyledLabel>Filter</StyledLabel>
            <Checkbox
              name="set:workflow.addRating"
              checked={view.workflow.addRating}
              onChange={this.handleCheckboxChange}
            >
              <div style={{ color: 'white' }}>Add rating</div>
            </Checkbox>
          </Col>
        </Row>
      </StyledContainer>
    );
  }
}

export default WorkflowForm;
