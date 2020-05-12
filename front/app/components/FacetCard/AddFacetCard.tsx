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
  font-size: 175px;
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
  titleSuggestions: any[];
  descriptionSuggestions: any[];
  isSuggestionLoading: boolean;
}

class AddFacetCard extends React.PureComponent<
  AddFacetCardProps,
  AddFacetCardState
> {
  state = {
    title: '',
    description: '',
    showForm: false,
    titleSuggestions: [],
    descriptionSuggestions: [],
    isSuggestionLoading: false,
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

  renderTitleSuggestion = suggestion => {
    // const capitalized = capitalize(suggestion);
    console.log(suggestion);
    if (suggestion.partialString) {
      return (
        <Row>
          <span>{`add "${suggestion}" as new description`}</span>
          <ThemedAutosuggestButton>Add</ThemedAutosuggestButton>
        </Row>
      );
    }
    return (
      <Row>
        <span>{`${suggestion}`}</span>
        <ThemedAutosuggestButton>Add</ThemedAutosuggestButton>
      </Row>
    );
  };

  handleTitleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      title: e.target.value,
    });
  };

  handleDescriptionFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      description: e.target.value,
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

  render() {
    const { title, description, showForm, titleSuggestions } = this.state;
    const { user, aggNames, siteView, values } = this.props;
    if (showForm) {
      return (
        <MarginContainer>
          <MarginContainer>Label</MarginContainer>
          <AddFieldAuto
            fields={aggNames}
            renderSuggestion={this.renderTitleSuggestion}
          />
          <MarginContainer>Description</MarginContainer>
          <AddDescAuto siteView={siteView} values={values} label={'color'} />
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
          style={{ color: 'inherit', fontSize: 'inherit' }}
          inverse={false}
          name="plus-square"
          onClick={() => this.handleButtonClick(user)}
        />
      </ThemedCenterButton>
    );
  }
}

export default AddFacetCard;
