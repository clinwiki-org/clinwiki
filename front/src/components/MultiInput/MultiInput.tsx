import * as React from 'react';
import styled from 'styled-components';
import reject from 'ramda/es/reject';
import equals from 'ramda/es/equals';
import { Typeahead } from 'react-bootstrap-typeahead';
import MultiCrumb from 'components/MultiCrumb';
import {
  difference,
  find,
  propEq,
  findIndex,
} from 'ramda';
import withTheme from '../../containers/ThemeProvider';

interface MultiInputProps {
  name: string;
  value: string[];
  options?: { id: string; label: string }[];
  placeholder?: string;
  draggable?: boolean;
  onInputChange?: (value: string) => void;
  onChange: (e: { currentTarget: { name: string; value: any } }) => void;
}

interface MultiInputState {
  dragging: string | null;
  dropping: string | null;
}

const CrumbsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
const CrumbContainer = styled.div`
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

  ${props => (props.draggable ? 'cursor: pointer' : '')}
`;

const Dropzone = styled.div`
  width: 15px;
  ${({ active }: { active?: boolean | null }) => (active ? 'width: 70px' : '')}
`;

const AddContainer = styled.div`
  ul > li > a {
    color: #333 !important;
  }
`;

const ThemedCrumbContainer = withTheme(CrumbContainer);
const ThemedCrumbsContainer = withTheme(CrumbsContainer);
const ThemedDropzone = withTheme(Dropzone);
const ThemedAddContainer = withTheme(AddContainer);

class MultiInput extends React.Component<MultiInputProps, MultiInputState> {
  state: MultiInputState = {
    dragging: null,
    dropping: null,
  };
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
    const newValues = difference(
      values.map(i => i.id),
      this.props.value
    );
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

  handleDragStart = e => {
    e.dataTransfer.setData('text/plain', e.target.id);
    e.dataTransfer.dropEffect = 'move';
    this.setState({ dragging: e.target.id });
  };

  handleDragOver = e => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (this.state.dropping !== e.target.id) {
      this.setState({ dropping: e.target.id });
    }
  };

  handleDragEnd = e => {
    e.preventDefault();
    this.setState({ dragging: null, dropping: null });
  };

  handleDrop = e => {
    e.preventDefault();
    const newValues = this.props.value.filter(
      value => value !== this.state.dragging
    );
    const droppableIndex = findIndex(equals(this.state.dropping), newValues);
    this.state.dragging &&
      newValues.splice(droppableIndex, 0, this.state.dragging);

    this.props.onChange({
      currentTarget: { name: this.props.name, value: newValues },
    });
    this.setState({ dragging: null, dropping: null });
  };

  render() {
    const options = reject(
      option => this.props.value.includes(option.id),
      this.props.options || []
    );
    return (
      <div>
        <ThemedCrumbsContainer>
          {this.props.value.map((value, i) => (
            <React.Fragment key={value}>
              {(this.state.dragging || i > 0) && (
                <ThemedDropzone
                  id={value}
                  active={this.state.dropping === value}
                  onDragOver={this.handleDragOver}
                  onDrop={this.handleDrop}
                />
              )}
              <ThemedCrumbContainer
                id={value}
                key={value}
                draggable={this.props.draggable}
                onDragStart={this.handleDragStart}
                onDragEnd={this.handleDragEnd}>
                <MultiCrumb
                  values={[value]}
                  labels={[this.getLabel(value)]}
                  onClick={this.handleDelete}
                />
              </ThemedCrumbContainer>
            </React.Fragment>
          ))}
        </ThemedCrumbsContainer>
        <ThemedAddContainer>
          <Typeahead
            id={this.props.name}
            ref={this.typeahead}
            options={options}
            type="text"
            name="newValue"
            open={this.props.options ? undefined : false}
            placeholder={this.props.placeholder}
            onInputChange={this.handleInputChange}
            onChange={this.handleChange}
          />
        </ThemedAddContainer>
      </div>
    );
  }
}

export default MultiInput;
