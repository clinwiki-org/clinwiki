import * as React from 'react';
import styled from 'styled-components';
import * as Autosuggest from 'react-autosuggest';
import { gql, ApolloClient } from 'apollo-boost';
import ThemedAutosuggestButton from 'components/StyledComponents';
import { ApolloConsumer } from 'react-apollo';

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const AUTOSUGGEST_QUERY = gql`
  query CrumbsSearchPageAggBucketsQuery(
    $agg: String!
    $q: SearchQueryInput!
    $aggFilters: [AggFilterInput!]
    $crowdAggFilters: [AggFilterInput!]
    $page: Int!
    $pageSize: Int!
    $aggOptionsFilter: String
    $aggFields: [String!]!
    $crowdAggFields: [String!]!
    $url: String
  ) {
    autocomplete(
      aggFields: $aggFields
      crowdAggFields: $crowdAggFields
      url: $url
      params: {
        agg: $agg
        q: $q
        sorts: []
        aggFilters: $aggFilters
        crowdAggFilters: $crowdAggFilters
        aggOptionsFilter: $aggOptionsFilter
        aggOptionsSort: [{ id: "count", desc: true }]
        page: $page
        pageSize: $pageSize
      }
    ) {
      autocomplete {
        name
        isCrowd
        results {
          key
          docCount
        }
        __typename
      }
      __typename
    }
  }
`;

interface AddDescAutoProps {
  siteView: any;
  values: any;
  handleInputChange: any;
  description: any;
  title: any;
}

interface AddDescAutoState {
  suggestions: any;
  input: string;
  isSuggestionLoading: boolean;
}

class AddDescAuto extends React.PureComponent<
  AddDescAutoProps,
  AddDescAutoState
> {
  state = {
    suggestions: [],
    input: '',
    isSuggestionLoading: false,
  };

  getSuggestions = async apolloClient => {
    const { values, title, description } = this.props;
    const query = AUTOSUGGEST_QUERY;
    const variables = {
      agg: 'browse_condition_mesh_terms',
      aggFilters: [],
      aggOptionsFilter: description,
      crowdAggFilters: [],
      page: 0,
      pageSize: 5,
      q: {
        children: [],
        key: 'AND',
      },
      sorts: [],
      aggFields: [],
      crowdAggFields: [title],
    };
    const response = await apolloClient.query({
      query,
      variables,
    });

    const array = response.data.autocomplete.autocomplete[0].results;

    array.map(({ key, docCount }, i) => {
      values?.map(([value, checked]) => {
        if (key === value) {
          if (checked) {
            array.splice(i, 1);
          }
          if (key === '-99999999999') {
            array.splice(i, 1);
          } else {
            // console.log('good data', array[i]);
          }
        }
      });
    });

    const suggestions = [
      { key: description.trim(), partialString: true },
      ...array,
    ];

    return suggestions;
  };

  renderFieldSuggestion = suggestion => {
    // const capitalized = capitalize(suggestion);
    if (suggestion.partialString) {
      return (
        <Row>
          <span>{`add "${suggestion.key}" as new description`}</span>
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

  onSuggestionSelected = (
    event,
    { suggestion, suggestionValue, suggestionIndex, method }
  ) => {
    this.setState({
      input: suggestionValue,
    });
  };

  onSuggestionsFetchRequested = async apolloClient => {
    this.setState({
      suggestions: await this.getSuggestions(apolloClient),
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      isSuggestionLoading: true,
    });
  };

  getSuggestionValue = suggestion => {
    return suggestion.key;
  };

  render() {
    const { suggestions } = this.state;
    const { handleInputChange, description, title } = this.props;
    console.log(suggestions);
    return (
      <ApolloConsumer>
        {apolloClient => (
          <Autosuggest
            suggestions={suggestions}
            renderSuggestion={this.renderFieldSuggestion}
            inputProps={{
              disabled: title ? false : true,
              value: description,
              onChange: handleInputChange,
            }}
            onSuggestionSelected={this.onSuggestionSelected}
            onSuggestionsFetchRequested={() =>
              this.onSuggestionsFetchRequested(apolloClient)
            }
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            getSuggestionValue={this.getSuggestionValue}
          />
        )}
      </ApolloConsumer>
    );
  }
}

export default AddDescAuto;
