import * as React from 'react';
import { FormControl } from 'react-bootstrap';
import ButtonCell from './ButtonCell';
import CurrentUser from 'containers/CurrentUser';
import ThemedButton from 'components/StyledComponents/index';

interface CrowdLabelProps {
  name: string;
  value: string;
  onAddClick?: (key: string) => void;
  onDeleteClick?: (key: string, value: string) => void;
  onSubmitClick?: (key: string, oldValue: string, value: string) => void;
}

interface CrowdLabelState {
  inEditMode: boolean;
  value: string | null;
  prevPropsValue: string | null;
}

class CrowdLabel extends React.Component<CrowdLabelProps, CrowdLabelState> {
  state: CrowdLabelState = {
    inEditMode: false,
    value: null,
    prevPropsValue: null,
  };

  static getDerivedStateFromProps = (
    props: CrowdLabelProps,
    state: CrowdLabelState
  ) => {
    if (state.value == null) {
      return { ...state, value: props.value, prevPropsValue: props.value };
    }
    if (state.prevPropsValue !== props.value) {
      return { ...state, value: props.value, prevPropsValue: props.value };
    }

    return state;
  };

  handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ value: e.currentTarget.value });
  };
  handleAddClick = () => {
    this.props.onAddClick && this.props.onAddClick(this.props.name);
  };
  handleDeleteClick = () => {
    this.props.onDeleteClick &&
      this.props.onDeleteClick(this.props.name, this.props.value);
  };
  handleSubmitClick = () => {
    this.props.onSubmitClick &&
      this.props.onSubmitClick(
        this.props.name,
        this.props.value,
        this.state.value || ''
      );
    this.setState({ inEditMode: false });
  };
  handleEditClick = () => {
    this.setState({ inEditMode: true });
  };

  render() {
    const { name, value } = this.props;

    return (
      <tr key={`${name}-${value}`}>
        <td>{name}</td>
        <td style={{ borderRight: 0 }}>
          {this.state.inEditMode ? (
            <FormControl
              componentClass="textarea"
              placeholder="Add a description"
              value={this.state.value}
              onChange={this.handleDescriptionChange}
            />
          ) : (
            value
          )}
        </td>
        <CurrentUser>
          {user => {
            if (!user) {
              return (
                <>
                  <ButtonCell />
                  <ButtonCell />
                  <ButtonCell />
                </>
              );
            }
            return (
              <>
                <ButtonCell>
                  <div>
                    <ThemedButton onClick={this.handleAddClick}>
                      Add
                    </ThemedButton>
                  </div>
                </ButtonCell>

                {this.state.inEditMode && (
                  <ButtonCell>
                    <div>
                      <ThemedButton onClick={this.handleSubmitClick}>
                        Submit
                      </ThemedButton>
                    </div>
                  </ButtonCell>
                )}

                {!this.state.inEditMode && (
                  <ButtonCell>
                    <div>
                      <ThemedButton onClick={this.handleEditClick}>
                        Edit
                      </ThemedButton>
                    </div>
                  </ButtonCell>
                )}

                <ButtonCell>
                  <div>
                    <ThemedButton onClick={this.handleDeleteClick}>
                      Delete
                    </ThemedButton>
                  </div>
                </ButtonCell>
              </>
            );
          }}
        </CurrentUser>
      </tr>
    );
  }
}

export default CrowdLabel;
