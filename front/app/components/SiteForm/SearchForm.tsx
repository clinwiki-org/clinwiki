import * as React from 'react';
import { Row, Col } from 'react-bootstrap';
import { SiteViewFragment } from 'types/SiteViewFragment';
import { displayFields } from 'utils/siteViewHelpers';
import { StyledContainer, StyledFormControl, StyledLabel } from './Styled';
import MultiInput from 'components/MultiInput';
import AggField from './AggField';
import { sentanceCase } from 'utils/helpers';
import { aggsOrdered, studyFields } from 'utils/constants';
import aggToField from 'utils/aggs/aggToField';
import { FilterKind } from 'types/globalTypes';
import { Checkbox } from 'react-bootstrap';
import styled from 'styled-components';

interface SearchFormProps {
  view: SiteViewFragment;
  onAddMutation: (e: { currentTarget: { name: string; value: any } }) => void;
}

interface SearchFormState {
  showAllAggs: boolean;
  showAllCrowdAggs: boolean;
}

const SEARCH_FIELDS = studyFields.map(option => ({
  id: option,
  label: sentanceCase(option),
}));

const AGGS_OPTIONS = aggsOrdered.map(option => ({
  id: option,
  label: sentanceCase(aggToField(option)),
}));

const AggsHeaderContainer = styled.div`
  display: flex;
  color: white;
  align-items: center;
  justify-content: space-between;
  margin: 25px 0 10px 0;

  h3 {
    margin: 0;
  }
`;

const StyledCheckbox = styled(Checkbox)`
  display: flex;
  align-items: center;
`;

class SearchForm extends React.Component<SearchFormProps, SearchFormState> {
  state: SearchFormState = { showAllAggs: false, showAllCrowdAggs: false };

  getCrowdFields = () => {
    return this.props.view.search.crowdAggs.fields.map(field => ({
      id: field.name,
      label: sentanceCase(field.name),
    }));
  };

  handleShowAllToggle = (kind: 'aggs' | 'crowdAggs') => () => {
    if (kind == 'aggs') {
      this.setState({ showAllAggs: !this.state.showAllAggs });
    } else {
      this.setState({ showAllCrowdAggs: !this.state.showAllCrowdAggs });
    }
  };

  handleFieldsOrderChange = () => {};

  render() {
    const view = this.props.view;

    const fields = displayFields(
      this.state.showAllAggs
        ? FilterKind.BLACKLIST
        : view.search.aggs.selected.kind,
      this.state.showAllAggs ? [] : view.search.aggs.selected.values,
      view.search.aggs.fields
    );
    const crowdFields = displayFields(
      this.state.showAllCrowdAggs
        ? FilterKind.BLACKLIST
        : view.search.crowdAggs.selected.kind,
      this.state.showAllCrowdAggs ? [] : view.search.crowdAggs.selected.values,
      view.search.crowdAggs.fields
    );

    return (
      <StyledContainer>
        <h3>Fields</h3>
        <MultiInput
          name="set:search.fields"
          options={SEARCH_FIELDS}
          placeholder="Add field"
          draggable
          value={view.search.fields}
          onChange={this.props.onAddMutation}
        />
        <Row>
          <Col md={6}>
            <AggsHeaderContainer>
              <h3>Aggs visibility</h3>
              <StyledCheckbox
                checked={this.state.showAllAggs}
                onChange={this.handleShowAllToggle('aggs')}>
                Show all
              </StyledCheckbox>
            </AggsHeaderContainer>
            <StyledLabel>Filter</StyledLabel>
            <StyledFormControl
              name="set:search.aggs.selected.kind"
              componentClass="select"
              onChange={this.props.onAddMutation}
              value={view.search.aggs.selected.kind}>
              <option value="BLACKLIST">All except</option>
              <option value="WHITELIST">Only</option>
            </StyledFormControl>
            <MultiInput
              name="set:search.aggs.selected.values"
              options={AGGS_OPTIONS}
              placeholder="Add facet"
              value={view.search.aggs.selected.values}
              onChange={this.props.onAddMutation}
            />
            <h3>Aggs settings</h3>
            {fields.map(field => (
              <AggField
                kind="aggs"
                key={field.name}
                field={field}
                onAddMutation={this.props.onAddMutation}
              />
            ))}
          </Col>
          <Col md={6}>
            <AggsHeaderContainer>
              <h3>Crowd aggs visibility</h3>
              <StyledCheckbox
                checked={this.state.showAllCrowdAggs}
                onChange={this.handleShowAllToggle('crowdAggs')}>
                Show all
              </StyledCheckbox>
            </AggsHeaderContainer>

            <StyledLabel>Filter</StyledLabel>
            <StyledFormControl
              name="set:search.crowdAggs.selected.kind"
              componentClass="select"
              onChange={this.props.onAddMutation}
              v={view.search.crowdAggs.selected.kind}>
              <option value="BLACKLIST">All except</option>
              <option value="WHITELIST">Only</option>
            </StyledFormControl>
            <MultiInput
              name="set:search.crowdAggs.selected.values"
              options={this.getCrowdFields()}
              placeholder="Add facet"
              value={view.search.crowdAggs.selected.values}
              onChange={this.props.onAddMutation}
            />
            <h3>Crowd aggs settings</h3>
            {crowdFields.map(field => (
              <AggField
                kind="crowdAggs"
                key={field.name}
                field={field}
                onAddMutation={this.props.onAddMutation}
              />
            ))}
          </Col>
        </Row>
      </StyledContainer>
    );
  }
}

export default SearchForm;
