import * as React from 'react';
import { FormControl } from 'react-bootstrap';
import styled from 'styled-components';
import ButtonCell from './ButtonCell';
import ThemedButton from 'components/StyledComponents/index';

interface AddCrowdLabelProps {
  onAddLabel: (key: string, value: string) => void;
  // pass not null to this prop if you want to toggle add mode with this key
  forceAddLabel?: { key: string; value: string } | null;
  name?: string;
}

interface AddCrowdLabelState {
  inAddMode: boolean;
  key: string;
  value: string;
  prevForceAddLabel: { key: string; value: string } | null;
}

const defaultState = {
  inAddMode: false,
  key: '',
  value: '',
  prevForceAddLabel: null,
};

const StyleWrapper = styled.tr`
  input,
  textarea {
    width: '100%';
    border: '1px solid #ccc';
  }
`;

class AddCrowdLabel extends React.Component<
  AddCrowdLabelProps,
  AddCrowdLabelState
> {
  state: AddCrowdLabelState = defaultState;

  static getDerivedStateFromProps = (
    props: AddCrowdLabelProps,
    state: AddCrowdLabelState
  ) => {
    const key = props.forceAddLabel && props.forceAddLabel.key;
    if (key && state.prevForceAddLabel !== props.forceAddLabel) {
      return {
        ...state,
        key,
        inAddMode: true,
        value: defaultState.value,
        prevForceAddLabel: props.forceAddLabel,
      };
    }

    return { ...state, prevForceAddLabel: props.forceAddLabel };
  };

  handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ key: e.currentTarget.value });
  };

  handleValueChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ value: e.currentTarget.value });
  };

  handleSubmit = () => {
    this.props.onAddLabel(this.state.key, this.state.value);
    this.setState(defaultState);
  };

  handleAddClick = () => {
    this.setState({ inAddMode: true });
  };

  render() {
    return (
      <StyleWrapper>
        <td style={{ verticalAlign: 'middle', width: '20%' }}>
          {this.state.inAddMode && (
            <FormControl
              type="text"
              placeholder="Add a label"
              value={this.state.key}
              onChange={this.handleKeyChange}
            />
          )}
        </td>
        <td style={{ borderRight: 'none', width: '50%' }}>
          {this.state.inAddMode && (
            <FormControl
              componentClass="textarea"
              placeholder="Add a description"
              value={this.state.value}
              onChange={this.handleValueChange}
            />
          )}
        </td>
        <ButtonCell>
          <div />
        </ButtonCell>
        <ButtonCell>
          <div />
        </ButtonCell>
        <ButtonCell>
          <div>
            {this.state.inAddMode && (
              <ThemedButton onClick={this.handleSubmit}>Submit</ThemedButton>
            )}
            {!this.state.inAddMode && (
              <ThemedButton onClick={this.handleAddClick}>
                {this.props.name || 'Add'}
              </ThemedButton>
            )}
          </div>
        </ButtonCell>
      </StyleWrapper>
    );
  }
}

export default AddCrowdLabel;
