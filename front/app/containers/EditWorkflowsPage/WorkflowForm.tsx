import * as React from 'react';
import styled from 'styled-components';
import { FormControl, Checkbox } from 'react-bootstrap';
import {
  WorkflowConfigFragment_wikiSectionsFilter,
  WorkflowConfigFragment,
} from 'types/WorkflowConfigFragment';
import MultiInput from 'components/MultiInput';

const StyledFormControl = styled(FormControl)`
  margin-bottom: 15px;
`;

interface WorkflowFormProps {
  workflow: WorkflowConfigFragment;
  onAddMutation: (e: { currentTarget: { name: string; value: any } }) => void;
}

const StyledLabel = styled.label`
  margin-top: 15px;
`;

const StyledCheckbox = styled(Checkbox)`
  display: flex;
  align-items: center;
`;

class WorkflowForm extends React.PureComponent<WorkflowFormProps> {
  handleCheckboxToggle = value => (e: {
    currentTarget: { name: string; value: any };
  }) => {
    this.props.onAddMutation({
      currentTarget: { name: e.currentTarget.name, value: !value },
    });
  };

  render() {
    return (
      <div>
        <h3>{this.props.workflow.name}</h3>

        <StyledLabel>Facets</StyledLabel>
        <StyledFormControl
          name={`set:workflows.${
            this.props.workflow.name
          }.suggestedLabelsFilter.kind`}
          componentClass="select"
          onChange={this.props.onAddMutation}
          value={this.props.workflow.suggestedLabelsFilter.kind}
        >
          <option value="BLACKLIST">All except</option>
          <option value="WHITELIST">Only</option>
        </StyledFormControl>
        <MultiInput
          name={`set:workflows.${
            this.props.workflow.name
          }.suggestedLabelsFilter.values`}
          options={this.props.workflow.allSuggestedLabels.map(field => ({
            id: field,
            label: field,
          }))}
          placeholder="Add field"
          value={this.props.workflow.suggestedLabelsFilter.values}
          onChange={this.props.onAddMutation}
        />

        <StyledLabel>Reviews</StyledLabel>
        <StyledCheckbox
          name={`set:workflows.${this.props.workflow.name}.hideReviews`}
          checked={this.props.workflow.hideReviews}
          onChange={this.handleCheckboxToggle(this.props.workflow.hideReviews)}
        >
          Hide Reviews section
        </StyledCheckbox>
        <StyledCheckbox
          name={`set:workflows.${this.props.workflow.name}.disableAddRating`}
          checked={this.props.workflow.disableAddRating}
          onChange={this.handleCheckboxToggle(
            this.props.workflow.disableAddRating,
          )}
        >
          Disable add rating
        </StyledCheckbox>

        <StyledLabel>Wiki sections</StyledLabel>
        <StyledFormControl
          name={`set:workflows.${
            this.props.workflow.name
          }.wikiSectionsFilter.kind`}
          componentClass="select"
          onChange={this.props.onAddMutation}
          value={this.props.workflow.wikiSectionsFilter.kind}
        >
          <option value="BLACKLIST">All except</option>
          <option value="WHITELIST">Only</option>
        </StyledFormControl>
        <MultiInput
          name={`set:workflows.${
            this.props.workflow.name
          }.wikiSectionsFilter.values`}
          options={this.props.workflow.allWikiSections.map(field => ({
            id: field,
            label: field,
          }))}
          placeholder="Add field"
          value={this.props.workflow.wikiSectionsFilter.values}
          onChange={this.props.onAddMutation}
        />
        <StyledLabel>Summary fields</StyledLabel>
        <StyledFormControl
          name={`set:workflows.${
            this.props.workflow.name
          }.summaryFieldsFilter.kind`}
          componentClass="select"
          onChange={this.props.onAddMutation}
          value={this.props.workflow.summaryFieldsFilter.kind}
        >
          <option value="BLACKLIST">All except</option>
          <option value="WHITELIST">Only</option>
        </StyledFormControl>
        <MultiInput
          name={`set:workflows.${
            this.props.workflow.name
          }.summaryFieldsFilter.values`}
          options={this.props.workflow.allSummaryFields.map(field => ({
            id: field,
            label: field,
          }))}
          placeholder="Add field"
          value={this.props.workflow.summaryFieldsFilter.values}
          onChange={this.props.onAddMutation}
        />
      </div>
    );
  }
}

export default WorkflowForm;
