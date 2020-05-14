import * as React from 'react';
import styled from 'styled-components';
import withTheme from 'containers/ThemeProvider';
import { FormControl } from 'react-bootstrap';
import * as FontAwesome from 'react-fontawesome';
import ThemedButton from 'components/StyledComponents';
import * as Autosuggest from 'react-autosuggest';
import AddFieldAuto from 'components/FacetCard/AddFieldAuto';
import AddDescAuto from 'components/FacetCard/AddDescAuto';
import ThemedAutosuggestButton from 'components/StyledComponents';

const MarginContainer = styled.div`
  margin: 4px;
`;

const CenterButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.button};
  font-size: 150px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ThemedCenterButton = withTheme(CenterButton);

interface AddFacetCardProps {
  submitFacet?: any;
  upsert?: any;
  user?: any;
  showLogin: any;
  apolloClient?: any;
  aggNames?: any;
  siteView?: any;
  values?: any;
}

interface AddFacetCardState {
  title: string;
  description: string;
  showForm: boolean;
  descDisabled: boolean;
}

class AddFacetCard extends React.PureComponent<
  AddFacetCardProps,
  AddFacetCardState
> {
  state = {
    showForm: false,
    descDisabled: true,
    title: '',
    description: '',
  };

  handleButtonClick = user => {
    if (user) {
      this.setState({
        showForm: true,
      });
    } else {
      this.props.showLogin(true);
    }
  };

  handleTitleFieldChange = (e, { newValue }) => {
    this.setState({
      title: newValue,
    });
  };

  handleDescriptionFieldChange = (e, { newValue }) => {
    this.setState({
      description: newValue,
    });
  };

  handleSubmit = () => {
    const { title, description } = this.state;
    this.props.submitFacet(title, description, this.props.upsert);
    this.setState({
      showForm: false,
      title: '',
      description: '',
    });
  };

  handleCancel = () => {
    this.setState({
      showForm: false,
    });
  };

  onFieldSuggestionSelected = (
    event,
    { suggestion, suggestionValue, suggestionIndex, method }
  ) => {
    this.setState({
      title: suggestionValue,
    });
  };

  render() {
    const { showForm, title, description } = this.state;
    const { user, aggNames, siteView, values } = this.props;
    if (showForm) {
      return (
        <MarginContainer>
          <MarginContainer>Label</MarginContainer>
          <AddFieldAuto
            fields={aggNames}
            handleInputChange={this.handleTitleFieldChange}
            field={title}
            onSuggestionSelected={this.onFieldSuggestionSelected}
          />
          <MarginContainer>Description</MarginContainer>
          <AddDescAuto
            siteView={siteView}
            values={values}
            handleInputChange={this.handleDescriptionFieldChange}
            description={description}
            title={title}
          />
          <div style={{ marginTop: 5, marginLeft: 2, marginBottom: 5 }}>
            <ThemedButton
              style={{ marginRight: 5 }}
              onClick={this.handleSubmit}>
              Submit
            </ThemedButton>
            <ThemedButton onClick={this.handleCancel}>Cancel</ThemedButton>
          </div>
        </MarginContainer>
      );
    }
    return (
      <ThemedCenterButton>
        <FontAwesome
          style={{ color: 'inherit', fontSize: 'inherit', margin: 'auto' }}
          inverse={true}
          name="plus-square-o"
          onClick={() => this.handleButtonClick(user)}
        />
      </ThemedCenterButton>
    );
  }
}

export default AddFacetCard;
