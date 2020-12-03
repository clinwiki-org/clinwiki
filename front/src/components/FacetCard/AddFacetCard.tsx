import * as React from 'react';
import styled from 'styled-components';
import ThemedButton, { PresearchContent } from 'components/StyledComponents';
import * as Autosuggest from 'react-autosuggest';
import AddFieldAuto from 'components/FacetCard/AddFieldAuto';
import ThemedAutosuggestButton from 'components/StyledComponents';
import { ApolloConsumer } from 'react-apollo';
import AUTOSUGGEST_QUERY from 'queries/CrumbsSearchPageAggBucketsQuery'

const MarginContainer = styled.div`
  margin: 4px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

interface AddFacetCardProps {
  submitFacet?: any;
  upsert?: any;
  user?: any;
  showLogin: any;
  apolloClient?: any;
  aggNames?: any;
  values?: any;
  showAddFacet: boolean;
}

interface AddFacetCardState {
  title: string;
  description: string;
  showForm: boolean;
  descDisabled: boolean;
  descriptionSuggestions: any[];
  isSuggestionLoading: boolean;
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

  handleTitleFieldChange = (e, { newValue }) => {
    this.setState({
      title: newValue,
    });
  };

  handleDescriptionFieldChange = (e, { newValue }, apolloClient) => {
    this.setState(
      {
        description: newValue,
      },
      () => {
        this.getSuggestions(apolloClient);
      }
    );
  };

  getSuggestions = async apolloClient => {
    const { values } = this.props;
    const { title, description } = this.state;

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

    if (values[title]) {
      array.map(({ key }, i) => {
        values[title].map(([value, checked]) => {
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
    }

    const suggestions = [
      { key: description.trim(), partialString: true },
      ...array,
    ];

    this.setState({
      descriptionSuggestions: suggestions,
      isSuggestionLoading: false,
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
    { suggestionValue }
  ) => {
    this.setState({
      title: suggestionValue,
    });
  };

  onSuggestionSelected = (
    event,
    { suggestionValue }
  ) => {
    this.setState({
      description: suggestionValue,
    });
  };

  onSuggestionsFetchRequested = async () => {
    this.setState({
      isSuggestionLoading: true,
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      descriptionSuggestions: [],
      isSuggestionLoading: true,
    });
  };

  getSuggestionValue = suggestion => {
    return suggestion.key;
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

  render() {
    const { title, description, descriptionSuggestions } = this.state;
    const { aggNames, showAddFacet } = this.props;
    if (showAddFacet) {
      return (
        <PresearchContent style={{ overflowY: 'auto' }}>
          <MarginContainer>
            <MarginContainer>Label</MarginContainer>
            <AddFieldAuto
              fields={aggNames}
              handleInputChange={this.handleTitleFieldChange}
              field={title}
              onSuggestionSelected={this.onFieldSuggestionSelected}
            />
            <MarginContainer>Description</MarginContainer>
            <ApolloConsumer>
              {apolloClient => (
                <Autosuggest
                  suggestions={descriptionSuggestions}
                  renderSuggestion={this.renderFieldSuggestion}
                  inputProps={{
                    disabled: title ? false : true,
                    value: description ? description : '',
                    onChange: (e, value) =>
                      this.handleDescriptionFieldChange(e, value, apolloClient),
                  }}
                  onSuggestionSelected={this.onSuggestionSelected}
                  onSuggestionsFetchRequested={() =>
                  this.onSuggestionsFetchRequested()
                  }
                  onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                  getSuggestionValue={this.getSuggestionValue}
                />
              )}
            </ApolloConsumer>
            <div style={{ marginTop: 5, marginLeft: 2, marginBottom: 5 }}>
              <ThemedButton
                style={{ marginRight: 5 }}
                onClick={this.handleSubmit}>
                Submit
              </ThemedButton>
              <ThemedButton onClick={this.handleCancel}>Cancel</ThemedButton>
            </div>
          </MarginContainer>
        </PresearchContent>
      );
    }
    return <PresearchContent style={{ height: 0 }}></PresearchContent>;
  }
}

export default AddFacetCard;
