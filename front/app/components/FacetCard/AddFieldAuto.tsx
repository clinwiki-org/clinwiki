import * as React from 'react';
import styled from 'styled-components';
import * as Autosuggest from 'react-autosuggest';
import ThemedAutosuggestButton from 'components/StyledComponents';
import { any } from 'prop-types';
import { gql } from 'apollo-boost';

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const USER_QUERY = gql`
  query User($userId: Int!) {
    user(userId: $userId) {
      firstName
      lastName
      reviewCount
      rank
      reviews {
        nctId
        briefTitle
        content
      }
      contributions
      pictureUrl
    }
  }
`;

interface AddFieldAutoProps {
  fields: any[];
  field: any;
  handleInputChange: any;
  onSuggestionSelected: any;
}

interface AddFieldAutoState {
  isSuggestionLoading: boolean;
  suggestions: any[];
}

class AddFieldAuto extends React.PureComponent<
  AddFieldAutoProps,
  AddFieldAutoState
> {
  state = {
    isSuggestionLoading: false,
    suggestions: [],
  };

  renderTitleSuggestion = suggestion => {
    if (suggestion.partialString) {
      return (
        <Row>
          <span>{`add "${suggestion.key}" as new label`}</span>
          <ThemedAutosuggestButton>Add</ThemedAutosuggestButton>
        </Row>
      );
    }
    return (
      <Row>
        <span>{`${suggestion.key}`}</span>
        <ThemedAutosuggestButton>Add</ThemedAutosuggestButton>
      </Row>
    );
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      isSuggestionLoading: true,
    });
  };

  getSuggestionValue = suggestion => {
    return suggestion.key;
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

    const newArr = array.filter(item => regex.test(item));
    let suggestions: { key: string; partialString: boolean }[] = [];
    newArr.map(item => {
      suggestions.push({ key: item, partialString: false });
    });
    const newSuggestions = [
      { key: input.trim(), partialString: true },
      ...suggestions,
    ];
    return newSuggestions;
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value, this.props.fields),
    });
  };

  storeInputReference = autosuggest => {
    if (autosuggest !== null) {
      //@ts-ignore
      this.input = autosuggest.input;
    }
  };

  render() {
    const { suggestions } = this.state;
    const { field, handleInputChange, onSuggestionSelected } = this.props;
    return (
      <Autosuggest
        suggestions={suggestions}
        renderSuggestion={this.renderTitleSuggestion}
        inputProps={{
          value: field ? field : '',
          onChange: handleInputChange,
          placeholder: 'Enter a new label',
        }}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={this.getSuggestionValue}
        onSuggestionSelected={onSuggestionSelected}
        ref={this.storeInputReference}
      />
    );
  }
}

export default AddFieldAuto;
