import * as React from 'react';
import styled from 'styled-components';
import aggToField from 'utils/aggs/aggToField';
import { FormControl } from 'react-bootstrap';
import {
  SiteViewFragment_search_aggs_fields,
  SiteViewFragment,
} from 'types/SiteViewFragment';
import AggDropDown from 'containers/AggDropDown';
import { reject, equals } from 'ramda';
import { AggKind } from 'containers/SearchPage/shared';
import { Checkbox } from 'react-bootstrap';
import { camelCase, capitalize } from 'utils/helpers';
import MultiCrumb from 'components/MultiCrumb';
import { AggFilterSiteConfigUpdater } from 'containers/SearchPage/components/AggFilterInputUpdater';
import AggFilterInputUpdateContext from 'containers/SearchPage/components/AggFilterUpdateContext';
import withTheme from 'containers/ThemeProvider';

interface AggFieldProps {
  kind: 'aggs' | 'crowdAggs';
  field: SiteViewFragment_search_aggs_fields;
  onAddMutation: (e: { currentTarget: { name: string; value: any } }) => void;
  view: SiteViewFragment;
  configType: 'presearch' | 'autosuggest' | 'facetbar';
  returnAll?: Boolean;
}

interface AggFieldState {
  isValuesOpen: boolean;
  isVisibleOptionsOpen: boolean;
  isChecked: boolean;
}

const FiltersContainer = styled.div`
  display: flex;
`;

const ContainerRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
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

const StyledKind = styled(FormControl)`
  flex: 1 1 0;
  margin-left: 15px;
`;

const StyledCheckbox = styled(Checkbox)`
  display: flex;
  align-items: center;
  margin-left: 5px;
  marign-top: 7px;
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

  getPath = configType => {
    if (configType == 'presearch') {
      return `search.presearch.${this.props.kind}.fields.${this.props.field.name}`;
    } else if (configType == 'autosuggest') {
      return `search.autoSuggest.${this.props.kind}.fields.${this.props.field.name}`;
    }
    return `search.${this.props.kind}.fields.${this.props.field.name}`;
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

  handleOpen = (kind: 'preselected' | 'visibleOptions') => (
    agg: string,
    aggKind: AggKind
  ) => {
    if (kind === 'preselected') {
      this.setState({ isValuesOpen: !this.state.isValuesOpen });
    } else {
      this.setState({ isVisibleOptionsOpen: !this.state.isVisibleOptionsOpen });
    }
  };
  renderDisplayLabel = configType => {
    if (this.props.kind !== 'crowdAggs') {
      return (
        <span>
          <ThemedStyledLabel>Agg Label:</ThemedStyledLabel>
          <StyledFormControl
            name={`set:${this.getPath(configType)}.displayName`}
            //@ts-ignore
            placeholder={aggToField(
              this.props.field.name,
              this.props.field.displayName
            )}
            value={this.props.field.rank}
            onChange={this.props.onAddMutation}
          />
        </span>
      );
    } else {
      return null;
    }
  };

  getUpdaters() {
    const preselectedUpdater = new AggFilterSiteConfigUpdater(
      this.props.field.name,
      this.props.field.preselected,
      this.props.onAddMutation,
      this.props.kind,
      'preselected',
      this.props.configType
    );
    const visibleOptionsUpdater = new AggFilterSiteConfigUpdater(
      this.props.field.name,
      this.props.field.visibleOptions,
      this.props.onAddMutation,
      this.props.kind,
      'visibleOptions',
      this.props.configType
    );
    return [preselectedUpdater, visibleOptionsUpdater];
  }

  render() {
    const { configType } = this.props;
    const selected = new Set(this.props.field.preselected.values);
    const visibleOptions = new Set(this.props.field.visibleOptions.values);
    const searchParams = {
      q: ({ key: 'AND', children: [] } as unknown) as string[],
      page: 0,
      pageSize: 25,
      aggFilters: [],
      crowdAggFilters: [],
      sorts: [],
    };
    const [preselectedUpdater, visibleOptionsUpdater] = this.getUpdaters();
    return (
      <>
        <h4>
          {aggToField(this.props.field.name, this.props.field.name)
            .split('_')
            .map(capitalize)
            .join(' ')}
        </h4>
        <ThemedContainer>
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
                    q: ({ key: 'AND', children: [] } as unknown) as string[],
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
          <div>
            <ThemedStyledLabel>Default Sort Type</ThemedStyledLabel>
            <StyledFormControl
              name={`set:${this.getPath(configType)}.order.sortKind`}
              componentClass="select"
              onChange={e => this.handleDefaultSortMutation(e)}
              defaultValue={this.props.field.order?.sortKind}>
              <option value="key">Alpha</option>
              <option value="count">Numeric</option>
            </StyledFormControl>
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
            </StyledFormControl>
          </div>
        </ThemedContainer>
      </>
    );
  }
}

export default AggField;
