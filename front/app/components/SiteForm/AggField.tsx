import * as React from 'react';
import styled from 'styled-components';
import aggToField from 'utils/aggs/aggToField';
import { FormControl } from 'react-bootstrap';
import { SiteViewFragment } from 'types/SiteViewFragment';
import AggDropDown from 'containers/AggDropDown';
import { camelCase, capitalize } from 'utils/helpers';
import MultiCrumb from 'components/MultiCrumb';
import {
  AggFilterSiteConfigUpdater,
  ConfigType,
} from 'containers/SearchPage/components/AggFilterInputUpdater';
import AggFilterInputUpdateContext from 'containers/SearchPage/components/AggFilterUpdateContext';
import withTheme from 'containers/ThemeProvider';
import { FieldDisplay, FilterKind } from 'types/globalTypes';

interface SiteSelect {
  kind: FilterKind;
  values: string[];
}

export interface FieldType {
  name: string;
  order: { sortKind: string; desc: boolean } | null;
  display: FieldDisplay;
  preselected?: SiteSelect | undefined;
  visibleOptions: SiteSelect;
  autoSuggest?: boolean;
  rank: number | null;
  displayName?: string;
  rangeStartLabel?: string;
  rangeEndLabel?: string;
}

export interface OptionVisibility {
  hideVisibleOptions: boolean;
  hideSortType: boolean;
  hideSortOrder: boolean;
  hideRank: boolean;
  hideDisplayType: boolean;
  hidePreSelected: boolean;
}

interface AggFieldProps {
  kind: 'aggs' | 'crowdAggs';
  field: FieldType;
  onAddMutation: (e: { currentTarget: { name: string; value: any } }) => void;
  view: SiteViewFragment;
  configType: ConfigType;
  returnAll?: Boolean;
  workflowName?: string;
  optionsVisibility?: Partial<OptionVisibility>;
}

interface AggFieldState {
  isValuesOpen: boolean;
  isVisibleOptionsOpen: boolean;
  isChecked: boolean;
}

const FiltersContainer = styled.div`
  display: flex;
`;

const CrumbsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 5px 0 15px 0;
  span.label {
    background: #55b88d;
    padding: 5px;
    font-size: 12px;
    border-radius: 4px;
    margin-right: 5px;
    margin-bottom: 15px;
    text-transform: capitalize;

    span.fa-remove {
      color: #fff !important;
      opacity: 0.5;
      margin-left: 5px !important;
    }

    span.fa-remove:hover {
      opacity: 1;
    }
  }
  span.label.label-default {
    padding: 7px !important;
    border-radius: 2px !important;
  }
`;

const FilterContainer = styled.div`
  flex: 3 1 0;
  .panel-heading {
    padding: 4px 15px;
  }
`;

const StyledLabel = styled.label`
  color: white;
`;

const Container = styled.div`
  background: rgba(255, 255, 255, 0.2);
  padding: 10px;
`;

const StyledFormControl = styled(FormControl)`
  margin-bottom: 20px;
`;

const ThemedContainer = withTheme(Container);
const ThemedStyledLabel = withTheme(StyledLabel);
const ThemedCrumbsContainer = withTheme(CrumbsContainer);

class AggField extends React.Component<AggFieldProps, AggFieldState> {
  state: AggFieldState = {
    isValuesOpen: false,
    isVisibleOptionsOpen: false,
    isChecked: false,
  };

  getPath = (configType: ConfigType) => {
    switch (configType) {
      case 'presearch':
        return `search.presearch.${this.props.kind}.fields.${this.props.field.name}`;
      case 'autosuggest':
        return `search.autoSuggest.${this.props.kind}.fields.${this.props.field.name}`;
      case 'facetbar':
        return `search.${this.props.kind}.fields.${this.props.field.name}`;
      case 'workflow':
        return `workflows.${this.props.workflowName}.suggestedLabelsConfig.${this.props.field.name}`;
    }
  };
  handleDefaultSortMutation = e => {
    this.props.onAddMutation(e);
  };
  handleCheckboxToggle = value => (e: {
    currentTarget: { name: string; value: any };
  }) => {
    this.props.onAddMutation({
      currentTarget: { name: e.currentTarget.name, value: !value },
    });
  };
  renderNumberRangeConfig = (configType, display) => {
    if (display == 'NUMBER_RANGE' || display == 'DATE_RANGE') {
      return (
        <span>
          <StyledLabel>Range Start Label</StyledLabel>

          <StyledFormControl
            name={`set:${this.getPath(configType)}.rangeStartLabel`}
            placeholder="Start"
            value={this.props.field.rangeStartLabel}
            onChange={this.props.onAddMutation}
          />
          <StyledLabel>Range End Label</StyledLabel>

          <StyledFormControl
            name={`set:${this.getPath(configType)}.rangeEndLabel`}
            placeholder="End"
            value={this.props.field.rangeEndLabel}
            onChange={this.props.onAddMutation}
          />
        </span>
      );
    } else {
      return (
        <span>
          <StyledLabel>Range Label</StyledLabel>

          <StyledFormControl
            name={
              display == 'GREATER_THAN_RANGE'
                ? `set:${this.getPath(configType)}.rangeStartLabel`
                : `set:${this.getPath(configType)}.rangeEndLabel`
            }
            placeholder={
              display == 'GREATER_THAN_RANGE'
                ? this.props.field.rangeStartLabel
                : this.props.field.rangeEndLabel
            }
            value={
              display == 'GREATER_THAN_RANGE'
                ? this.props.field.rangeStartLabel
                : this.props.field.rangeEndLabel
            }
            onChange={this.props.onAddMutation}
          />
        </span>
      );
    }
  };
  handleOpen = (kind: 'preselected' | 'visibleOptions') => () => {
    if (kind === 'preselected') {
      this.setState({ isValuesOpen: !this.state.isValuesOpen });
    } else {
      this.setState({ isVisibleOptionsOpen: !this.state.isVisibleOptionsOpen });
    }
  };
  renderDisplayLabel = (configType: ConfigType) => {
    return (
      <span>
        <ThemedStyledLabel>
          {this.props.kind == 'crowdAggs' ? 'Crowd ' : null}Agg Label:
        </ThemedStyledLabel>
        <StyledFormControl
          name={`set:${this.getPath(configType)}.displayName`}
          placeholder={aggToField(
            this.props.field.name,
            this.props.field.displayName
          )}
          value={this.props.field.rank}
          onChange={this.props.onAddMutation}
        />
      </span>
    );
  };

  getPreselectUpdater() {
    return new AggFilterSiteConfigUpdater(
      this.props.field.name,
      this.props.field?.preselected,
      this.props.onAddMutation,
      this.props.kind,
      'preselected',
      this.props.configType
    );
  }

  getVisibleOptionsUpdater() {
    return new AggFilterSiteConfigUpdater(
      this.props.field.name,
      this.props.field.visibleOptions,
      this.props.onAddMutation,
      this.props.kind,
      'visibleOptions',
      this.props.configType,
      this.props.workflowName
    );
  }

  getOptionVisibility() {
    const current = this.props.optionsVisibility || {};
    const defaultVisibility: OptionVisibility = {
      hideVisibleOptions: false,
      hideSortType: false,
      hideSortOrder: false,
      hideRank: false,
      hideDisplayType: false,
      hidePreSelected: false,
    };
    return { ...defaultVisibility, ...current };
  }

  renderPreselected(opVis: OptionVisibility) {
    const { field, configType } = this.props;
    if (!field.preselected || opVis.hidePreSelected) return null;
    const selected = new Set(field?.preselected?.values);
    const preselectedUpdater = this.getPreselectUpdater();
    const searchParams = {
      q: ({ key: 'AND', children: [] } as unknown) as string[],
      page: 0,
      pageSize: 25,
      aggFilters: [],
      crowdAggFilters: [],
      sorts: [],
    };
    return (
      <>
        {this.renderDisplayLabel(configType)}
        <ThemedStyledLabel>Preselected values</ThemedStyledLabel>
        <ThemedCrumbsContainer>
          {Array.from(selected).map(value => (
            <MultiCrumb
              key={value}
              values={[value]}
              onClick={value => preselectedUpdater.removeFilter(value)}
            />
          ))}
        </ThemedCrumbsContainer>
        <FiltersContainer>
          <FilterContainer>
            <AggFilterInputUpdateContext.Provider
              value={{
                updater: preselectedUpdater,
              }}>
              <AggDropDown
                agg={this.props.field.name}
                aggKind={this.props.kind}
                searchParams={searchParams}
                display={this.props.field.display}
                isOpen={this.state.isValuesOpen}
                selectedKeys={selected}
                onOpen={this.handleOpen('preselected')}
                currentSiteView={this.props.view}
                configType={this.props.configType}
                returnAll={this.props.returnAll}
              />
            </AggFilterInputUpdateContext.Provider>
          </FilterContainer>
        </FiltersContainer>
      </>
    );
  }

  renderVisibleOptions(opVis: OptionVisibility) {
    if (opVis.hideVisibleOptions) return null;
    const visibleOptions = new Set(this.props.field.visibleOptions.values);
    const visibleOptionsUpdater = this.getVisibleOptionsUpdater();
    return (
      <>
        <ThemedStyledLabel>Visible options</ThemedStyledLabel>
        <ThemedCrumbsContainer>
          {Array.from(visibleOptions).map(value => (
            <MultiCrumb
              key={value}
              values={[value]}
              onClick={value => visibleOptionsUpdater.removeFilter(value)}
            />
          ))}
        </ThemedCrumbsContainer>
        <FiltersContainer>
          <FilterContainer>
            <AggFilterInputUpdateContext.Provider
              value={{
                updater: visibleOptionsUpdater,
              }}>
              <AggDropDown
                agg={this.props.field.name}
                aggKind={this.props.kind}
                searchParams={{
                  q: ({
                    key: 'AND',
                    children: [],
                  } as unknown) as string[],
                  page: 0,
                  pageSize: 25,
                  aggFilters: [],
                  crowdAggFilters: [],
                  sorts: [],
                }}
                display={this.props.field.display}
                isOpen={this.state.isVisibleOptionsOpen}
                selectedKeys={visibleOptions}
                onOpen={this.handleOpen('visibleOptions')}
                currentSiteView={this.props.view}
                configType={this.props.configType}
                returnAll={this.props.returnAll}
              />
            </AggFilterInputUpdateContext.Provider>
          </FilterContainer>
        </FiltersContainer>
      </>
    );
  }

  renderSortType(opVis: OptionVisibility) {
    if (opVis.hideSortType) return null;
    const configType = this.props.configType;
    return (
      <>
        <ThemedStyledLabel>Default Sort Type</ThemedStyledLabel>
        <StyledFormControl
          name={`set:${this.getPath(configType)}.order.sortKind`}
          componentClass="select"
          onChange={e => this.handleDefaultSortMutation(e)}
          defaultValue={this.props.field.order?.sortKind}>
          <option value="key">Alpha</option>
          <option value="count">Numeric</option>
        </StyledFormControl>
      </>
    );
  }

  renderSortOrder(opVis: OptionVisibility) {
    if (opVis.hideSortOrder) return null;
    const configType = this.props.configType;
    return (
      <>
        <StyledLabel>Default Sort Order</StyledLabel>
        <StyledFormControl
          name={`set:${this.getPath(configType)}.order.desc`}
          componentClass="select"
          onChange={e => this.handleDefaultSortMutation(e)}
          defaultValue={this.props.field.order?.desc}>
          <option value="true">
            {this.props.field.order?.sortKind == 'count' ? '1-9' : 'A-Z'}
          </option>
          <option value="false">
            {this.props.field.order?.sortKind == 'count' ? '9-1' : 'Z-A'}
          </option>
        </StyledFormControl>
        <ThemedStyledLabel>Order</ThemedStyledLabel>
        <StyledFormControl
          name={`set:${this.getPath(configType)}.rank`}
          placeholder="Order"
          value={this.props.field.rank}
          onChange={this.props.onAddMutation}
        />
      </>
    );
  }

  renderDisplayType(opVis: OptionVisibility) {
    if (opVis.hideDisplayType) return null;
    const configType = this.props.configType;
    return (
      <>
        <ThemedStyledLabel>Display</ThemedStyledLabel>
        <StyledFormControl
          name={`set:${this.getPath(configType)}.display`}
          componentClass="select"
          onChange={this.props.onAddMutation}
          defaultValue={this.props.field.display}>
          <option value="STRING">Text</option>
          <option value="STAR">Stars</option>
          <option value="DATE">Date</option>
          <option value="DATE_RANGE">Date Range</option>
          <option value="NUMBER_RANGE">Number Range</option>
          <option value="LESS_THAN_RANGE">Less Than Range</option>
          <option value="GREATER_THAN_RANGE">Greater Than Range</option>
          <option value="PIE_CHART">Pie Chart</option>
        </StyledFormControl>
        {this.props.field.display == 'NUMBER_RANGE' ||
        this.props.field.display == 'LESS_THAN_RANGE' ||
        this.props.field.display == 'GREATER_THAN_RANGE' ||
        this.props.field.display == 'DATE_RANGE'
          ? this.renderNumberRangeConfig(configType, this.props.field.display)
          : null}
      </>
    );
  }

  render() {
    const vis = this.getOptionVisibility();
    return (
      <>
        <h4>
          {aggToField(this.props.field.name, this.props.field.name)
            .split('_')
            .map(capitalize)
            .join(' ')}
        </h4>
        <ThemedContainer>
          {this.renderPreselected(vis)}
          {this.renderVisibleOptions(vis)}
          {this.renderSortType(vis)}
          {this.renderSortOrder(vis)}
          {this.renderDisplayType(vis)}
        </ThemedContainer>
      </>
    );
  }
}

export default AggField;
