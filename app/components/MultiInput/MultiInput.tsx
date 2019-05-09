import * as React from 'react';
import styled from 'styled-components';
import reject from 'ramda/es/reject';
import equals from 'ramda/es/equals';
import { Typeahead } from 'react-bootstrap-typeahead';
import MultiCrumb from 'components/MultiCrumb';
import { __, prop, pipe, map, difference, find, propEq } from 'ramda';

interface MultiInputProps {
  name: string;
  value: string[];
  options?: { id: string; label: string }[];
  placeholder?: string;
  onInputChange?: (value: string) => void;
  onChange: (e: { currentTarget: { name: string; value: any } }) => void;
}

const CrumbsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
const CrumbContainer = styled.div`
  margin-right: 10px;
  margin-bottom: 15px;
  span.label {
    background: #55b88d;
    padding: 5px;
    font-size: 12px;
    border-radius: 4px;
    margin-right: 5px;
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

const AddContainer = styled.div``;

class MultiInput extends React.PureComponent<MultiInputProps> {
  typeahead = React.createRef<Typeahead>();

  getLabel = (id: string) => {
    const option = find(propEq('id', id), this.props.options || []) as {
      id: string;
      label: string;
    } | null;
    // fallback
    if (!option) return id;

    return option.label;
  };

  handleDelete = (value: string) => {
    this.props.onChange({
      currentTarget: {
        name: this.props.name,
        value: reject(equals(value), this.props.value),
      },
    });
  };

  handleChange = (values: { id: string; value: string[] }[]) => {
    // @ts-ignore
    const newValues = pipe(
      map(prop('id')),
      difference(__, this.props.value),
      // @ts-ignore
    )(values);
    this.props.onChange({
      currentTarget: {
        name: this.props.name,
        value: [...this.props.value, ...newValues],
      },
    });
    this.typeahead.current && this.typeahead.current.getInstance().clear();
  };

  handleInputChange = (value: string) => {
    this.props.onInputChange && this.props.onInputChange(value);
  };

  render() {
    const options = reject(
      option => this.props.value.includes(option.id),
      this.props.options || [],
    );
    return (
      <div>
        <CrumbsContainer>
          {this.props.value.map(value => (
            <CrumbContainer key={value}>
              <MultiCrumb
                values={[value]}
                labels={[this.getLabel(value)]}
                onClick={this.handleDelete}
              />
            </CrumbContainer>
          ))}
        </CrumbsContainer>
        <AddContainer>
          <Typeahead
            id={name}
            ref={this.typeahead}
            options={options}
            type="text"
            name="newValue"
            open={this.props.options ? undefined : false}
            placeholder={this.props.placeholder}
            onInputChange={this.handleInputChange}
            onChange={this.handleChange}
          />
        </AddContainer>
      </div>
    );
  }
}

export default MultiInput;
