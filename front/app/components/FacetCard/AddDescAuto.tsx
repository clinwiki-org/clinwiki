import * as React from 'react';
import styled from 'styled-components';
import * as Autosuggest from 'react-autosuggest';
import { gql } from 'apollo-boost';
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
  label: any;
}

interface AddDescAutoState {
  suggestions: any[];
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

  queryAutoSuggest = async apolloClient => {
    const { input } = this.state;
    const { values, label } = this.props;
    console.log(input);
    const query = AUTOSUGGEST_QUERY;
    const variables = {
      agg: 'browse_condition_mesh_terms',
      aggFilters: [],
      aggOptionsFilter: input,
      crowdAggFilters: [],
      page: 0,
      pageSize: 5,
      q: {
        children: [],
        key: 'AND',
      },
      sorts: [],
      aggFields: [],
      crowdAggFields: [],
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

    const newSet = new Set(array);
    const uniqArr = [...newSet];
    uniqArr.unshift({ key: input.trim(), partialString: true });

    this.setState({
      suggestions: uniqArr,
    });
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

  handleInputChange = (e, { newValue }, apolloClient) => {
    this.setState(
      {
        input: newValue,
        suggestions: [],
      },
      () => {
        this.queryAutoSuggest(apolloClient);
      }
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

  onSuggestionsFetchRequested = () => {
    this.setState({
      isSuggestionLoading: false,
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
    const { input, suggestions } = this.state;
    return (
      <ApolloConsumer>
        {apolloClient => (
          <Autosuggest
            suggestions={suggestions}
            renderSuggestion={this.renderFieldSuggestion}
            inputProps={{
              value: input,
              onChange: (e, value) =>
                this.handleInputChange(e, value, apolloClient),
            }}
            onSuggestionSelected={this.onSuggestionSelected}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            getSuggestionValue={this.getSuggestionValue}
          />
        )}
      </ApolloConsumer>
    );
  }
}

export default AddDescAuto;
