import * as React from 'react';
import { Row, Col } from 'react-bootstrap';
import { SiteViewFragment } from 'types/SiteViewFragment';
import { displayFields } from 'utils/siteViewHelpers';
import { StyledContainer, StyledFormControl, StyledLabel } from './Styled';
import MultiInput from 'components/MultiInput';
import AggField from './AggField';
import { capitalize } from 'utils/helpers';
import { aggsOrdered } from 'utils/constants';
import { FilterKind } from 'types/globalTypes';

interface SearchFormProps {
  view: SiteViewFragment;
  onAddMutation: (e: { currentTarget: { name: string; value: any } }) => void;
}

const AGGS_OPTIONS = aggsOrdered.map(option => ({
  id: option,
  label: option
    .split('_')
    .map(capitalize)
    .join(' '),
}));

class SearchForm extends React.PureComponent<SearchFormProps> {
  getCrowdFields = () => {
    return this.props.view.search.crowdAggs.fields.map(field => ({
      id: field.name,
      label: field.name
        .split('_')
        .map(capitalize)
        .join(' '),
    }));
  };

  render() {
    const view = this.props.view;
    const fields = displayFields(
      FilterKind.BLACKLIST,
      [],
      view.search.aggs.fields,
    );
    const crowdFields = displayFields(
      FilterKind.BLACKLIST,
      [],
      view.search.crowdAggs.fields,
    );

    return (
      <StyledContainer>
        <Row>
          <Col md={6}>
            <h3>Aggs visibility</h3>
            <StyledLabel>Filter</StyledLabel>
            <StyledFormControl
              name="set:search.aggs.selected.kind"
              componentClass="select"
              onChange={this.props.onAddMutation}
              defaultValue={view.search.aggs.selected.kind}
            >
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
            <h3>Crowd aggs visibility</h3>
            <StyledLabel>Filter</StyledLabel>
            <StyledFormControl
              name="set:search.crowdAggs.selected.kind"
              componentClass="select"
              onChange={this.props.onAddMutation}
              defaultValue={view.search.crowdAggs.selected.kind}
            >
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
