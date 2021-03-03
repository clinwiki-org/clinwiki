import * as React from 'react';
import styled from 'styled-components';
import { Panel, FormControl, Checkbox } from 'react-bootstrap';
import { WorkflowConfigFragment } from 'types/WorkflowConfigFragment';
import MultiInput from 'components/MultiInput';
import AggField, { FieldType } from 'components/SiteForm/AggField';
import { fromPairs, difference, find } from 'ramda';
import { SiteViewFragment } from 'services/site/model/SiteViewFragment';
import { MutationSource } from 'containers/SearchPage/shared';
import MailMergeFormControl from 'components/MailMerge/MailMergeFormControl';
import { connect } from 'react-redux';
//import {withPresentSite2} from "../PresentSiteProvider/PresentSiteProvider";

const StyledFormControl = styled(FormControl)`
  margin-bottom: 15px;
`;

interface WorkflowFormProps {
  workflow: WorkflowConfigFragment;
  onAddMutations: (e: MutationSource[]) => void;
  presentSiteView: SiteViewFragment;
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
    this.props.onAddMutations([
      {
        currentTarget: { name: e.currentTarget.name, value: !value },
      },
    ]);
  };

  handleAggFieldMutation = (
    workflow: WorkflowConfigFragment,
    aggField: FieldType
  ) => (mut: MutationSource) => {
    const workflowName = workflow.name;
    let mutations: MutationSource[] = [];
    if (
      !find(conf => conf.name === aggField.name, workflow.suggestedLabelsConfig)
    ) {
      // If there is no suggestedLabelsConfig we have to add it
      mutations.push({
        currentTarget: {
          name: `push:workflows.${workflowName}.suggestedLabelsConfig`,
          value: aggField,
        },
      });
    }
    mutations.push(mut);
    this.props.onAddMutations(mutations);
  };

  render() {
    const { workflow } = this.props;
    const config = fromPairs(
      workflow.suggestedLabelsConfig.map(c => [c.name, c])
    );
    const defaultFieldInfo = {
      order: { sortKind: 'key', desc: true },
      display: 'STRING',
      visibleOptions: { kind: 'WHITELIST', values: [] },
    };
    const facets =
      workflow.suggestedLabelsFilter.kind === 'WHITELIST'
        ? workflow.suggestedLabelsFilter.values
        : difference(
            workflow.allSuggestedLabels,
            workflow.suggestedLabelsFilter.values
          );
    const onAddMutation = e => this.props.onAddMutations([e]);
    return (
      <div>
        <h3>{this.props.workflow.name}</h3>
        <StyledLabel>Facets</StyledLabel>
        <StyledFormControl
          name={`set:workflows.${this.props.workflow.name}.suggestedLabelsFilter.kind`}
          componentClass="select"
          onChange={onAddMutation}
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
          onChange={onAddMutation}
        />

        <Panel style={{ Margin: '100px' }}>
          <Panel.Heading>
            <Panel.Title toggle>Facet Config</Panel.Title>
          </Panel.Heading>
          <Panel.Body
            collapsible
            style={{ backgroundColor: '#4d5863', color: 'white' }}>
            <StyledLabel>Configure Crowd Labels</StyledLabel>
            {facets.map(name => {
              const fieldInfo = {
                ...defaultFieldInfo,
                ...config[name],
                name: name,
              };
              return (
                <AggField
                  kind="crowdAggs"
                  key={name}
                  field={fieldInfo}
                  onAddMutation={this.handleAggFieldMutation(
                    this.props.workflow,
                    fieldInfo
                  )}
                  view={this.props.presentSiteView}
                  configType="workflow"
                  returnAll={true}
                  workflowName={this.props.workflow.name}
                  optionsVisibility={{
                    hideSortType: true,
                    hidePreSelected: true,
                    hideDisplayType: true,
                  }}
                />
              );
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
          onChange={onAddMutation}
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
          onChange={onAddMutation}
        />
        <StyledLabel>Summary</StyledLabel>
        <MailMergeFormControl
          template={this.props.workflow.summaryTemplate}
          onTemplateChanged={t =>
            onAddMutation({
              currentTarget: {
                name: `set:workflows.${this.props.workflow.name}.summaryTemplate`,
                value: t,
              },
            })
          }
        />
        {/*
        <StyledFormControl
          name={`set:workflows.${this.props.workflow.name}.summaryFieldsFilter.kind`}
          componentClass="select"
          onChange={onAddMutation}
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
          onChange={onAddMutation}
        /> */}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  presentSiteView: state.site.presentSiteProvider.site.siteView,
})

export default connect(mapStateToProps, null ) (WorkflowForm);
