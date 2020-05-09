import * as React from 'react';
import styled from 'styled-components';
import { Panel, Row, FormControl, Checkbox } from 'react-bootstrap';
import {
  WorkflowConfigFragment,
} from 'types/WorkflowConfigFragment';
import MultiInput from 'components/MultiInput';
import AggField from 'components/SiteForm/AggField';
import { fromPairs, difference } from 'ramda';
import { withSite2 } from 'containers/SiteProvider/SiteProvider';
import { SiteViewFragment } from 'types/SiteViewFragment';

const StyledFormControl = styled(FormControl)`
  margin-bottom: 15px;
`;

interface WorkflowFormProps {
  workflow: WorkflowConfigFragment;
  onAddMutation: (e: { currentTarget: { name: string; value: any } }) => void;
  currentSiteView : SiteViewFragment
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
    const { workflow } = this.props;
    const config = fromPairs(
      workflow.suggestedLabelsConfig.map(c => [c.name, c])
    );
    const defaultFieldInfo = {
      order: { sortKind: 'key', desc: true },
      display: "STRING",
      visibleOptions: { kind: "BLACKLIST", values: [] },
    }
    const facets =
      workflow.suggestedLabelsFilter.kind == 'WHITELIST'
        ? workflow.suggestedLabelsFilter.values
        : difference(
            workflow.allSuggestedLabels,
            workflow.suggestedLabelsFilter.values
          );
    return (
      <div>
        <h3>{this.props.workflow.name}</h3>
        <StyledLabel>Facets</StyledLabel>
        <StyledFormControl
          name={`set:workflows.${this.props.workflow.name}.suggestedLabelsFilter.kind`}
          componentClass="select"
          onChange={this.props.onAddMutation}
          value={this.props.workflow.suggestedLabelsFilter.kind}>
          <option value="BLACKLIST">All except</option>
          <option value="WHITELIST">Only</option>
        </StyledFormControl>
        <MultiInput
          name={`set:workflows.${this.props.workflow.name}.suggestedLabelsFilter.values`}
          options={this.props.workflow.allSuggestedLabels.map(field => ({
            id: field,
            label: field,
          }))}
          placeholder="Add field"
          value={this.props.workflow.suggestedLabelsFilter.values}
          onChange={this.props.onAddMutation}
        />

        <Panel style={{ Margin: '10px' }}>
          <Panel.Heading>
            <Panel.Title toggle>Facet Config</Panel.Title>
          </Panel.Heading>
          <Panel.Body collapsible style={{backgroundColor: '#4d5863', color: 'white'}}>
            <StyledLabel>Configure Crowd Labels</StyledLabel>
            {facets.map(name => {
              const fieldInfo = { name: name, ... defaultFieldInfo, ... config[name] };
              return <AggField
                kind='crowdAggs'
                key={name}
                field={fieldInfo}
                onAddMutation={s => console.log(s.currentTarget)}
                view={this.props.currentSiteView}
                configType="facetbar"
                returnAll={true}
              />
            })}
          </Panel.Body>
        </Panel>

        <StyledLabel>Reviews</StyledLabel>
        <StyledCheckbox
          name={`set:workflows.${this.props.workflow.name}.hideReviews`}
          checked={this.props.workflow.hideReviews}
          onChange={this.handleCheckboxToggle(this.props.workflow.hideReviews)}>
          Hide Reviews section
        </StyledCheckbox>
        <StyledCheckbox
          name={`set:workflows.${this.props.workflow.name}.disableAddRating`}
          checked={this.props.workflow.disableAddRating}
          onChange={this.handleCheckboxToggle(
            this.props.workflow.disableAddRating
          )}>
          Disable add rating
        </StyledCheckbox>

        <StyledLabel>Wiki sections</StyledLabel>
        <StyledFormControl
          name={`set:workflows.${this.props.workflow.name}.wikiSectionsFilter.kind`}
          componentClass="select"
          onChange={this.props.onAddMutation}
          value={this.props.workflow.wikiSectionsFilter.kind}>
          <option value="BLACKLIST">All except</option>
          <option value="WHITELIST">Only</option>
        </StyledFormControl>
        <MultiInput
          name={`set:workflows.${this.props.workflow.name}.wikiSectionsFilter.values`}
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
          name={`set:workflows.${this.props.workflow.name}.summaryFieldsFilter.kind`}
          componentClass="select"
          onChange={this.props.onAddMutation}
          value={this.props.workflow.summaryFieldsFilter.kind}>
          <option value="BLACKLIST">All except</option>
          <option value="WHITELIST">Only</option>
        </StyledFormControl>
        <MultiInput
          name={`set:workflows.${this.props.workflow.name}.summaryFieldsFilter.values`}
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

export default withSite2(WorkflowForm);
