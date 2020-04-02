import * as React from 'react';
import styled from 'styled-components';
import aggToField from 'utils/aggs/aggToField';
import { FormControl } from 'react-bootstrap';
import { SiteViewFragment_search_aggs_fields } from 'types/SiteViewFragment';
import AggDropDown from 'containers/AggDropDown';
import { reject, equals } from 'ramda';
import { AggKind } from 'containers/SearchPage/shared';
import { Checkbox } from 'react-bootstrap';
import { camelCase, capitalize } from 'utils/helpers';
import MultiCrumb from 'components/MultiCrumb';
import { AggFilterSiteConfigUpdater } from 'containers/SearchPage/components/AggFilterInputUpdater';
import AggFilterInputUpdateContext from 'containers/SearchPage/components/AggFilterUpdateContext';

interface AggFieldProps {
  kind: 'aggs' | 'crowdAggs';
  field: SiteViewFragment_search_aggs_fields;
  onAddMutation: (e: { currentTarget: { name: string; value: any } }) => void;
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

  getPath = () => `search.${this.props.kind}.fields.${this.props.field.name}`;

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

  render() {
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
    const preselectedUpdater = new AggFilterSiteConfigUpdater(
      this.props.field.name,
      this.props.field.preselected,
      this.props.onAddMutation,
      this.props.kind,
      'preselected'
    );
    const visibleOptionsUpdater = new AggFilterSiteConfigUpdater(
      this.props.field.name,
      this.props.field.visibleOptions,
      this.props.onAddMutation,
      this.props.kind,
      'visibleOptions'
    );
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
                onClick={value => preselectedUpdater.removeFilter(value)}
              />
            ))}
          </CrumbsContainer>
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
                onClick={value => visibleOptionsUpdater.removeFilter(value)}
              />
            ))}
          </CrumbsContainer>
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
                />
              </AggFilterInputUpdateContext.Provider>
            </FilterContainer>
          </FiltersContainer>
          <div>
            <StyledLabel>Order</StyledLabel>
            <StyledFormControl
              name={`set:${this.getPath()}.rank`}
              placeholder="Order"
              value={this.props.field.rank}
              onChange={this.props.onAddMutation}
            />
            <StyledLabel>Display</StyledLabel>
            <StyledFormControl
              name={`set:${this.getPath()}.display`}
              componentClass="select"
              onChange={this.props.onAddMutation}
              defaultValue={this.props.field.display}>
              <option value="STRING">Text</option>
              <option value="STAR">Stars</option>
              <option value="DATE">Date</option>
              <option value="RANGE">Range</option>
            </StyledFormControl>
          </div>
          {this.props.field.name !== 'average_rating' && (
            <ContainerRow>
              <StyledCheckbox
                name={`set:${this.getPath()}.autoSuggest`}
                checked={this.props.field.autoSuggest}
                onChange={this.handleCheckboxToggle(
                  this.props.field.autoSuggest
                )}
              />
              <h5>Add to Auto-Suggest</h5>
            </ContainerRow>
          )}
        </Container>
      </>
    );
  }
}

export default AggField;
