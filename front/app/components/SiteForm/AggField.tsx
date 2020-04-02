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
import AggFilterInputUpdater from 'containers/SearchPage/components/AggFilterInputUpdater';
import AggFilterInputUpdateContext from 'containers/SearchPage/components/AggFilterUpdateContext';

interface AggFieldProps {
  kind: 'aggs' | 'crowdAggs';
  field: SiteViewFragment_search_aggs_fields;
  onAddMutation: (
    e: { currentTarget: { name: string; value: any } },
    siteView: SiteViewFragment
  ) => void;
  view: SiteViewFragment;
  configType?: "presearch" | "autosuggest" | 'facetbar';
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

class AggField extends React.Component<AggFieldProps, AggFieldState> {
  state: AggFieldState = {
    isValuesOpen: false,
    isVisibleOptionsOpen: false,
    isChecked: false,
  };

  getPath = configType => {
    if (configType == 'presearch') {
      return `search.presearch.${this.props.kind}.fields.${this.props.field.name}`;
    }else if(configType == 'autosuggest'){
      return `search.autoSuggest.${this.props.kind}.fields.${this.props.field.name}`;
    }
    return `search.${this.props.kind}.fields.${this.props.field.name}`;
  };
  handleAddFilter = (kind: 'preselected' | 'visibleOptions') => (
    aggName: string,
    aggValue: string,
    isCrowd: boolean
  ) => {
    this.props.onAddMutation(
      {
        currentTarget: {
          name: `set:${this.getPath(this.props.configType)}.${kind}.values`,
          value: [...this.props.field[kind].values, aggValue],
        },
      },
      this.props.view
    );
  };
  handleSelectAll = (kind: 'preselected' | 'visibleOptions') => (
    aggName: string,
    newParams: any,
    isCrowd: boolean
  ) => {

    this.props.onAddMutation(
      {
        currentTarget: {
          name: `set:${this.getPath(this.props.configType)}.${kind}.values`,
          value:  newParams,
        },
      },
      this.props.view
    );
  };

  handleDeSelectAll = (kind: 'preselected' | 'visibleOptions') => (
    aggName: string,
    newParams: any,
    isCrowd: boolean
  ) => {
    const targetValue =()=>{
    if(kind=='preselected'){
      let newArray= this.props.field.preselected.values
       newParams.map(key=>{
        newArray =reject(equals(key), newArray)
      });
      return newArray
    }else{
      let newArray= this.props.field.visibleOptions.values
       newParams.map(key=>{
        newArray =reject(equals(key), newArray)
      });
      console.log("Final Array hope", newArray)
      return newArray
    }
  }
    this.props.onAddMutation(
      {
        currentTarget: {
          name: `set:${this.getPath(this.props.configType)}.${kind}.values`,
          value: targetValue(),
        },
      },
      this.props.view
    );
  };
  handleRemoveFilter = (kind: 'preselected' | 'visibleOptions') => (
    aggName: string,
    aggValue: string,
    isCrowd: boolean
  ) => {
    const targetValue =()=>{
    if(kind=='preselected'){
      return reject(equals(aggValue), this.props.field.preselected.values)    
    }else{
      return reject(equals(aggValue), this.props.field.visibleOptions.values) 
    }
  }
    this.props.onAddMutation(
      {
        currentTarget: {
          name: `set:${this.getPath(this.props.configType)}.${kind}.values`,
          value: targetValue(),
        },
      },
      this.props.view
    );
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
    return (
      <>
        <h4>
          {aggToField(this.props.field.name)
            .split('_')
            .map(capitalize)
            .join(' ')}
        </h4>
        <Container>
          <StyledLabel>Preselected values</StyledLabel>
          <CrumbsContainer>
            {Array.from(selected).map(value => (
              <MultiCrumb
                key={value}
                values={[value]}
                onClick={value =>
                  this.handleRemoveFilter('preselected')('', value, false)
                }
              />
            ))}
          </CrumbsContainer>
          <FiltersContainer>
            <FilterContainer>
              <AggFilterInputUpdateContext.Provider
                value={{
                  updater: new AggFilterInputUpdater(
                    this.props.field.name,
                    searchParams,
                    () => {
                      console.log('todo: how often do we actually use this?');
                    },
                    this.props.kind === 'aggs'
                      ? 'aggFilters'
                      : 'crowdAggFilters'
                  ),
                }}>
                <AggDropDown
                  agg={this.props.field.name}
                  aggKind={this.props.kind}
                  searchParams={searchParams}
                  display={this.props.field.display}
                  isOpen={this.state.isValuesOpen}
                  selectedKeys={selected}
                  addFilter={this.handleAddFilter('preselected')}
                  addAllFilters={this.handleSelectAll('preselected')}
                  removeFilter={this.handleRemoveFilter('preselected')}
                  removeAllFilters={this.handleDeSelectAll('preselected')}
                  onOpen={this.handleOpen('preselected')}
                  currentSiteView={this.props.view}
                  configType={this.props.configType}
                  returnAll={this.props.returnAll}

                />
              </AggFilterInputUpdateContext.Provider>
            </FilterContainer>
          </FiltersContainer>
          <StyledLabel>Visible options</StyledLabel>
          <CrumbsContainer>
            {Array.from(visibleOptions).map(value => (
              <MultiCrumb
                key={value}
                values={[value]}
                onClick={value =>
                  this.handleRemoveFilter('visibleOptions')('', value, false)
                }
              />
            ))}
          </CrumbsContainer>
          <FiltersContainer>
            <FilterContainer>
              <AggFilterInputUpdateContext.Provider
                value={{
                  updater: new AggFilterInputUpdater(
                    this.props.field.name,
                    searchParams,
                    () => {
                      console.log('todo: how often do we actually use this?');
                    },
                    this.props.kind === 'aggs'
                      ? 'aggFilters'
                      : 'crowdAggFilters'
                  ),
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
                  addFilter={this.handleAddFilter('visibleOptions')}
                  addAllFilters={this.handleSelectAll('visibleOptions')}
                  removeFilter={this.handleRemoveFilter('visibleOptions')}
                  removeAllFilters={this.handleDeSelectAll('visibleOptions')}
                  onOpen={this.handleOpen('visibleOptions')}
                  currentSiteView={this.props.view}
                  configType={this.props.configType}
                  returnAll={this.props.returnAll}

                />
              </AggFilterInputUpdateContext.Provider>
            </FilterContainer>
          </FiltersContainer>
          <div>
            <StyledLabel>Order</StyledLabel>
            <StyledFormControl
              name={`set:${this.getPath(configType)}.rank`}
              placeholder="Order"
              value={this.props.field.rank}
              onChange={this.props.onAddMutation}
            />
            <StyledLabel>Display</StyledLabel>
            <StyledFormControl
              name={`set:${this.getPath(configType)}.display`}
              componentClass="select"
              onChange={e => this.props.onAddMutation(e, this.props.view)}
              defaultValue={this.props.field.display}>
              <option value="STRING">Text</option>
              <option value="STAR">Stars</option>
              <option value="DATE">Date</option>
              <option value="RANGE">Range</option>
            </StyledFormControl>
          </div>
        </Container>
      </>
    );
  }
}

export default AggField;
