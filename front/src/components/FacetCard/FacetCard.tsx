import * as React from 'react';
import styled from 'styled-components';
import {
  ApolloConsumer,
} from 'react-apollo';
import ThemedAutosuggestButton, {
  ThemedPresearchCard,
  ThemedPresearchHeader,
  PresearchTitle,
  PresearchContent,
  TextFieldToggle,
} from 'components/StyledComponents';
import * as Autosuggest from 'react-autosuggest';
import AddFacetCard from './AddFacetCard';
import CrowdPage from 'containers/CrowdPage';
import CurrentUser from 'containers/CurrentUser';
import LoginModal from 'components/LoginModal';
import { truncateString } from 'containers/FacilitiesPage/FacilityUtils';
import AUTOSUGGEST_QUERY from 'queries/CrumbsSearchPageAggBucketsQuery'
import { UpsertMutationFn, UpsertMutationComponent, UPSERT_LABEL_MUTATION } from 'mutations/CrowdPageUpsertWikiLabelMutation';

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;



interface FacetCardProps {
  nctId: string;
  label: string;
  children?: any;
  onSelect?: (key: string, value: string, checked: boolean) => void;
  addLabel?: boolean;
  meta: Record<string, string>;
  values?: any[];
  refetch?: () => void;
  aggNames?: any;
  allValues?: any[];
  showAnimation:any;
}

interface FacetCardState {
  textFieldActive: boolean;
  existingField: string;
  suggestions: any[];
  isSuggestionLoading: boolean;
  showLoginModal: boolean;
  showAddFacet: boolean;
}

class FacetCard extends React.PureComponent<FacetCardProps, FacetCardState> {
  state = {
    textFieldActive: false,
    existingField: '',
    suggestions: [],
    isSuggestionLoading: false,
    showLoginModal: false,
    showAddFacet: false,
  };

  input: any;

  handlePlusClick = user => {
    if (user) {
      this.setState(
        {
          textFieldActive: !this.state.textFieldActive,
        },
        () => {
          if (this.state.textFieldActive) {
            this.input.focus();
          }
        }
      );
    } else {
      this.setShowLoginModal(true);
    }
  };

  handleAddFacetPlusClick = user => {
    if (user) {
      this.setState({
        showAddFacet: !this.state.showAddFacet,
      });
    } else {
      this.setShowLoginModal(true);
    }
  };

  setShowLoginModal = showLoginModal => {
    this.setState({ showLoginModal });
  };

  handleExistingFieldChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    { newValue },
    apolloClient
  ) => {
    this.setState(
      {
        existingField: newValue,
        suggestions: [],
      },
      () => {
        this.queryAutoSuggest(apolloClient);
      }
    );
  };

  queryAutoSuggest = async apolloClient => {
    const { existingField } = this.state;
    const { label, values } = this.props;
    const query = AUTOSUGGEST_QUERY;
    const variables = {
      // todo: probably want to query more than just browse_condition_mesh_terms
      agg: 'browse_condition_mesh_terms',
      aggFilters: [],
      aggOptionsFilter: existingField,
      crowdAggFilters: [],
      page: 0,
      pageSize: 5,
      q: {
        children: [],
        key: 'AND',
      },
      sorts: [],
      aggFields: [],
      crowdAggFields: [label],
    };
    const response = await apolloClient.query({
      query,
      variables,
    });

    const array = response.data.autocomplete.autocomplete[0].results;

    array.map(({ key }, i) => {
      values?.map(([value, checked]) => {
        if (key === value) {
          if (checked) {
            array.splice(i, 1);
          }
          if (key === '-99999999999') {
            array.splice(i, 1);
          }
        }
      });
    });

    const newSet = new Set(array);
    const uniqArr = [...newSet];
    uniqArr.unshift({ key: existingField.trim(), partialString: true });

    this.setState({
      suggestions: uniqArr,
    });
  };

  submitExistingField = (
    key: string,
    value: string,
    meta: {},
    upsertLabelMutation: UpsertMutationFn
  ) => {
    if (this.props.nctId) {
      CrowdPage.addLabel(
        key,
        value,
        meta,
        this.props.nctId,
        upsertLabelMutation
      );
      if (this.props.refetch) (this.props.refetch());
    }
  };

  handleButtonClick = upsertLabelMutation => {
    this.submitExistingField(
      this.props.label,
      this.state.existingField,
      this.props.meta,
      upsertLabelMutation
    );
    this.setState({ textFieldActive: false });
  };

  handleNewFacetSubmit = (key, value, upsertLabelMutation) => {
    this.props.showAnimation()
    this.submitExistingField(key, value, this.props.meta, upsertLabelMutation);
  };

  renderSuggestion = suggestion => {
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

  onSuggestionSelected = (e,
    { suggestionValue },
    upsertLabelMutation
  ) => {
    this.setState({
      textFieldActive: false,
      existingField: '',
    });
    this.submitExistingField(
      this.props.label,
      suggestionValue,
      this.props.meta,
      upsertLabelMutation
    );
  };

  onSuggestionsFetchRequested = () => {
    this.setState({
      isSuggestionLoading: true,
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
      isSuggestionLoading: true,
    });
  };

  getSuggestionValue = suggestion => {
    return suggestion.key;
  };

  storeInputReference = autosuggest => {
    if (autosuggest !== null) {
      this.input = autosuggest.input;
    }
  };

  render() {
    const { label, addLabel, aggNames, allValues } = this.props;
    const {
      textFieldActive,
      existingField,
      suggestions,
      showLoginModal,
      showAddFacet,
    } = this.state;

    if (addLabel) {
      console.log(allValues);
      return (
        <CurrentUser>
          {user => (
            <ApolloConsumer>
              {apolloClient => (
                <UpsertMutationComponent mutation={UPSERT_LABEL_MUTATION}>
                  {upsertLabelMutation => (
                    <>
                      <LoginModal
                        show={showLoginModal}
                        cancel={() => this.setShowLoginModal(false)}
                      />
                      <ThemedPresearchCard
                        style={{ height: showAddFacet ? null : 60 }}>
                        <ThemedPresearchHeader>
                          <PresearchTitle>
                            {truncateString(label, 18, true)}
                          </PresearchTitle>
                          {!showAddFacet && (
                            <TextFieldToggle
                              onClick={() =>
                                this.handleAddFacetPlusClick(user)
                              }>
                              +
                            </TextFieldToggle>
                          )}
                          {showAddFacet && (
                            <TextFieldToggle
                              onClick={this.handleAddFacetPlusClick}>
                              -
                            </TextFieldToggle>
                          )}
                        </ThemedPresearchHeader>
                        <AddFacetCard
                          upsert={upsertLabelMutation}
                          submitFacet={this.handleNewFacetSubmit}
                          user={user}
                          showLogin={this.setShowLoginModal}
                          apolloClient={apolloClient}
                          aggNames={aggNames}
                          values={allValues}
                          showAddFacet={showAddFacet}
                        />
                      </ThemedPresearchCard>
                    </>
                  )}
                </UpsertMutationComponent>
              )}
            </ApolloConsumer>
          )}
        </CurrentUser>
      );
    }
    return (
      <CurrentUser>
        {user => (
          <ApolloConsumer>
            {apolloClient => (
              <UpsertMutationComponent mutation={UPSERT_LABEL_MUTATION}>
                {upsertLabelMutation => (
                  <>
                    <LoginModal
                      show={showLoginModal}
                      cancel={() => this.setShowLoginModal(false)}
                    />
                    <ThemedPresearchCard>
                      <ThemedPresearchHeader>
                        <PresearchTitle>
                          {truncateString(label, 18, true)}
                        </PresearchTitle>
                        {!textFieldActive && (
                          <TextFieldToggle
                            onClick={() => this.handlePlusClick(user)}>
                            +
                          </TextFieldToggle>
                        )}
                        {textFieldActive && (
                          <TextFieldToggle onClick={this.handlePlusClick}>
                            -
                          </TextFieldToggle>
                        )}
                      </ThemedPresearchHeader>
                      {textFieldActive && (
                        <Autosuggest
                          suggestions={suggestions}
                          renderSuggestion={this.renderSuggestion}
                          inputProps={{
                            placeholder: 'enter a new description...',
                            value: existingField,
                            onChange: (e, existingField) =>
                              this.handleExistingFieldChange(
                                e,
                                existingField,
                                apolloClient
                              ),
                          }}
                          onSuggestionSelected={(e,
                            {
                              suggestionValue,
                            },
                          ) =>
                            this.onSuggestionSelected(e,
                              {
                                suggestionValue,
                              },
                              upsertLabelMutation
                            )
                          }
                          onSuggestionsFetchRequested={
                            this.onSuggestionsFetchRequested
                          }
                          onSuggestionsClearRequested={
                            this.onSuggestionsClearRequested
                          }
                          getSuggestionValue={this.getSuggestionValue}
                          ref={this.storeInputReference}
                        />
                      )}
                      <PresearchContent style={{ overflowY: 'auto' }}>
                        {this.props.children}
                      </PresearchContent>
                    </ThemedPresearchCard>
                  </>
                )}
              </UpsertMutationComponent>
            )}
          </ApolloConsumer>
        )}
      </CurrentUser>
    );
  }
}

export default FacetCard;
