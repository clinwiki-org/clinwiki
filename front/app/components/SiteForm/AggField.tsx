import * as React from "react";
import styled from "styled-components";
import aggToField from "utils/aggs/aggToField";
import { FormControl } from "react-bootstrap";
import {
  SiteViewFragment_search_aggs_fields,
  SiteViewFragment
} from "types/SiteViewFragment";
import AggDropDown from "containers/AggDropDown";
import { reject, equals } from "ramda";
import { AggKind } from "containers/SearchPage/shared";
import { Checkbox } from "react-bootstrap";
import { camelCase, capitalize } from "utils/helpers";
import MultiCrumb from "components/MultiCrumb";

interface AggFieldProps {
  kind: "aggs" | "crowdAggs";
  field: SiteViewFragment_search_aggs_fields;
  onAddMutation: (
    e: { currentTarget: { name: string; value: any } },
    siteView: SiteViewFragment
  ) => void;
  view: SiteViewFragment;
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
    isChecked: false
  };

  getPath = () => `search.${this.props.kind}.fields.${this.props.field.name}`;

  handleAddFilter = (kind: "preselected" | "visibleOptions") => (
    aggName: string,
    aggValue: string,
    isCrowd: boolean
  ) => {
    this.props.onAddMutation(
      {
        currentTarget: {
          name: `set:${this.getPath()}.${kind}.values`,
          value: [...this.props.field[kind].values, aggValue]
        }
      },
      this.props.view
    );
  };

  handleCheckboxToggle = value => (e: {
    currentTarget: { name: string; value: any };
  }) => {
    this.props.onAddMutation(
      {
        currentTarget: { name: e.currentTarget.name, value: !value }
      },
      this.props.view
    );
  };

  handleRemoveFilter = (kind: "preselected" | "visibleOptions") => (
    aggName: string,
    aggValue: string,
    isCrowd: boolean
  ) => {
    this.props.onAddMutation(
      {
        currentTarget: {
          name: `set:${this.getPath()}.${kind}.values`,
          value: reject(equals(aggValue), this.props.field.preselected.values)
        }
      },
      this.props.view
    );
  };

  handleOpen = (kind: "preselected" | "visibleOptions") => (
    agg: string,
    aggKind: AggKind
  ) => {
    if (kind === "preselected") {
      this.setState({ isValuesOpen: !this.state.isValuesOpen });
    } else {
      this.setState({ isVisibleOptionsOpen: !this.state.isVisibleOptionsOpen });
    }
  };

  render() {
    const selected = new Set(this.props.field.preselected.values);
    const visibleOptions = new Set(this.props.field.visibleOptions.values);
    return (
      <>
        <h4>
          {aggToField(this.props.field.name)
            .split("_")
            .map(capitalize)
            .join(" ")}
        </h4>
        <Container>
          <StyledLabel>Preselected values</StyledLabel>
          <CrumbsContainer>
            {Array.from(selected).map(value => (
              <MultiCrumb
                key={value}
                values={[value]}
                onClick={value =>
                  this.handleRemoveFilter("preselected")("", value, false)
                }
              />
            ))}
          </CrumbsContainer>
          <FiltersContainer>
            <FilterContainer>
              <AggDropDown
                agg={this.props.field.name}
                aggKind={this.props.kind}
                searchParams={{
                  q: ({ key: "AND", children: [] } as unknown) as string[],
                  page: 0,
                  pageSize: 25,
                  aggFilters: [],
                  crowdAggFilters: [],
                  sorts: []
                }}
                display={this.props.field.display}
                isOpen={this.state.isValuesOpen}
                selectedKeys={selected}
                addFilter={this.handleAddFilter("preselected")}
                removeFilter={this.handleRemoveFilter("preselected")}
                onOpen={this.handleOpen("preselected")}
              />
            </FilterContainer>
          </FiltersContainer>
          <StyledLabel>Visible options</StyledLabel>
          <CrumbsContainer>
            {Array.from(visibleOptions).map(value => (
              <MultiCrumb
                key={value}
                values={[value]}
                onClick={value =>
                  this.handleRemoveFilter("visibleOptions")("", value, false)
                }
              />
            ))}
          </CrumbsContainer>
          <FiltersContainer>
            <FilterContainer>
              <AggDropDown
                agg={this.props.field.name}
                aggKind={this.props.kind}
                searchParams={{
                  q: ({ key: "AND", children: [] } as unknown) as string[],
                  page: 0,
                  pageSize: 25,
                  aggFilters: [],
                  crowdAggFilters: [],
                  sorts: []
                }}
                display={this.props.field.display}
                isOpen={this.state.isVisibleOptionsOpen}
                selectedKeys={visibleOptions}
                addFilter={this.handleAddFilter("visibleOptions")}
                removeFilter={this.handleRemoveFilter("visibleOptions")}
                onOpen={this.handleOpen("visibleOptions")}
              />
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
              onChange={e => this.props.onAddMutation(e, this.props.view)}
              defaultValue={this.props.field.display}
            >
              <option value="STRING">Text</option>
              <option value="STAR">Stars</option>
              <option value="DATE">Date</option>
            </StyledFormControl>
          </div>
          {this.props.field.name !== "average_rating" && (
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
