import * as React from 'react';
import styled from 'styled-components';
import * as Autosuggest from 'react-autosuggest';
import ThemedAutosuggestButton from 'components/StyledComponents';

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

interface AddFieldAutoProps {
  fields: any[];
  renderSuggestion: any;
}

interface AddFieldAutoState {
  input: string;
  isSuggestionLoading: boolean;
  suggestions: any[];
}

class AddFieldAuto extends React.PureComponent<
  AddFieldAutoProps,
  AddFieldAutoState
> {
  state = {
    input: '',
    isSuggestionLoading: false,
    suggestions: [],
  };

  handleInputChange = (e, { newValue }) => {
    this.setState({
      input: newValue,
    });
  };

  // onSuggestionSelected = (
  //   event,
  //   { suggestion, suggestionValue, suggestionIndex, method }
  // ) => {
  //   this.setState({
  //     input: suggestionValue,
  //   });
  // };

  // onSuggestionsFetchRequested = () => {
  //   this.setState({
  //     isSuggestionLoading: true,
  //   });
  // };

  onSuggestionsClearRequested = () => {
    this.setState({
      isSuggestionLoading: true,
    });
  };

  getSuggestionValue = suggestion => {
    return suggestion;
  };

  escapeRegexChars = str => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  getSuggestions = (input, array) => {
    const escapedValue = this.escapeRegexChars(input.trim());
    if (escapedValue === '') {
      return [];
    }

    const regex = new RegExp('^' + escapedValue, 'i');
    console.log('regex', regex);
    return array.filter(item => regex.test(item));
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value, this.props.fields),
    });
  };

  renderFieldSuggestion = suggestion => {
    // const capitalized = capitalize(suggestion);
    return (
      <Row>
        <span>{`${suggestion}`}</span>
        <ThemedAutosuggestButton>Add</ThemedAutosuggestButton>
      </Row>
    );
  };

  render() {
    const { input, suggestions } = this.state;
    return (
      <Autosuggest
        suggestions={suggestions}
        renderSuggestion={this.renderFieldSuggestion}
        inputProps={{
          value: input ? input : '',
          onChange: this.handleInputChange,
        }}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={this.getSuggestionValue}
      />
    );
  }
}

export default AddFieldAuto;
