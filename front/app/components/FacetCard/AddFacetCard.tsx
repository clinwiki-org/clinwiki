import * as React from 'react';
import styled from 'styled-components';
import withTheme from 'containers/ThemeProvider';
import { FormControl } from 'react-bootstrap';
import * as FontAwesome from 'react-fontawesome';
import ThemedButton from 'components/StyledComponents';

const MarginContainer = styled.div`
  margin: 4px;
`;

const CenterButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.button};
  font-size: 175px;
`;

const ThemedCenterButton = withTheme(CenterButton);

interface AddFacetCardProps {
  submitFacet?: any;
  upsert?: any;
}

interface AddFacetCardState {
  label: string;
  description: string;
  showForm: boolean;
}

class AddFacetCard extends React.PureComponent<
  AddFacetCardProps,
  AddFacetCardState
> {
  state = {
    label: '',
    description: '',
    showForm: false,
  };

  handleButtonClick = () => {
    this.setState({
      showForm: true,
    });
  };

  handleLabelFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      label: e.target.value,
    });
  };

  handleDescriptionFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      description: e.target.value,
    });
  };

  handleSubmit = () => {
    const { label, description } = this.state;
    this.props.submitFacet(label, description, this.props.upsert);
    this.setState({
      showForm: false,
      label: '',
      description: '',
    });
  };

  render() {
    const { label, description, showForm } = this.state;
    if (showForm) {
      return (
        <MarginContainer>
          <MarginContainer>Label</MarginContainer>
          <FormControl
            name="label"
            placeholder="Add a label"
            value={label}
            onChange={this.handleLabelFieldChange}
          />
          <MarginContainer>Description</MarginContainer>
          <FormControl
            name="description"
            placeholder="Add a description"
            value={description}
            onChange={this.handleDescriptionFieldChange}
          />
          <div style={{ marginTop: 5, marginLeft: 2, marginBottom: 5 }}>
            <ThemedButton onClick={this.handleSubmit}>Submit</ThemedButton>
          </div>
        </MarginContainer>
      );
    }
    return (
      <ThemedCenterButton>
        <FontAwesome
          style={{ color: 'inherit', fontSize: 'inherit' }}
          inverse={false}
          name="plus-square"
          onClick={this.handleButtonClick}
        />
      </ThemedCenterButton>
    );
  }
}

export default AddFacetCard;
