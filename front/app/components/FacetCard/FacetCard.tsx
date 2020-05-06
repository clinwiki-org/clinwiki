import * as React from 'react';
import styled from 'styled-components';
import { capitalize } from 'utils/helpers';
import { gql } from 'apollo-boost';
import { Mutation, MutationFn } from 'react-apollo';
import { ApolloConsumer } from 'react-apollo';
import ThemedAutosuggestButton, {
  ThemedPresearchCard,
  ThemedPresearchHeader,
  PresearchTitle,
  PresearchContent,
  TextFieldToggle,
} from 'components/StyledComponents';
import { uniq } from 'ramda';
import {
  CrowdPageUpsertWikiLabelMutation,
  CrowdPageUpsertWikiLabelMutationVariables,
} from 'types/CrowdPageUpsertWikiLabelMutation';
import { WikiPageEditFragment } from 'components/Edits';
import * as Autosuggest from 'react-autosuggest';
import AddFacetCard from './AddFacetCard';
import CrowdPage from 'containers/CrowdPage';
import CurrentUser from 'containers/CurrentUser';
import LoginModal from 'components/LoginModal';

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

const FRAGMENT = gql`
  fragment CrowdPageFragment on WikiPage {
    nctId
    meta
  }
`;

export const UPSERT_LABEL_MUTATION = gql`
  mutation CrowdPageUpsertWikiLabelMutation(
    $nctId: String!
    $key: String!
    $value: String!
  ) {
    upsertWikiLabel(input: { nctId: $nctId, key: $key, value: $value }) {
      wikiPage {
        ...CrowdPageFragment
        edits {
          ...WikiPageEditFragment
        }
      }
      errors
    }
  }

  ${FRAGMENT}
  ${WikiPageEditFragment}
`;

export class UpsertMutationComponent extends Mutation<
  CrowdPageUpsertWikiLabelMutation,
  CrowdPageUpsertWikiLabelMutationVariables
> {}

export type UpsertMutationFn = MutationFn<
  CrowdPageUpsertWikiLabelMutation,
  CrowdPageUpsertWikiLabelMutationVariables
>;

interface FacetCardProps {
  nctId?: string;
  label: string;
  children?: any;
  onSelect?: any;
  bulk?: boolean;
  addLabel?: boolean;
  meta?: any;
  siteView?: any;
  values?: [string, boolean][];
  user?: any;
  refetch?: any;
}

interface FacetCardState {
  textFieldActive: boolean;
  existingField: string;
  suggestions: any[];
  isSuggestionLoading: boolean;
  showLoginModal: boolean;
}

class FacetCard extends React.PureComponent<FacetCardProps, FacetCardState> {
  state = {
    textFieldActive: false,
    existingField: '',
    suggestions: [],
    isSuggestionLoading: false,
    showLoginModal: false,
  };

  handlePlusClick = user => {
    if (user) {
      this.setState({
        textFieldActive: !this.state.textFieldActive,
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
    const { siteView, label, values } = this.props;

    const query = AUTOSUGGEST_QUERY;
    const variables = {
      agg: 'browse_condition_mesh_terms',
      aggFilters: [],
      aggOptionsFilter: existingField,
      crowdAggFilters: [],
      page: 0,
      pageSize: 5,
      url: siteView.url,
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

    array.map(({ key, docCount }, i) => {
      values?.map(([value, checked]) => {
        if (key === value) {
          if (checked) {
            array.splice(i, 1);
          }
          if (key === '-99999999999') {
            array.splice(i, 1);
          } else {
            console.log('good data', array[i]);
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
      this.props.refetch();
    } else alert('error');
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

  onSuggestionSelected = (
    event,
    { suggestion, suggestionValue, suggestionIndex, method },
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

  render() {
    const { label, addLabel, bulk, user } = this.props;
    const {
      textFieldActive,
      existingField,
      suggestions,
      showLoginModal,
    } = this.state;

    if (bulk) {
      return (
        <ThemedPresearchCard>
          <ThemedPresearchHeader>
            <PresearchTitle>{capitalize(label)}</PresearchTitle>
          </ThemedPresearchHeader>
          <PresearchContent style={{ overflowY: 'auto' }}>
            {this.props.children}
          </PresearchContent>
        </ThemedPresearchCard>
      );
    }
    if (addLabel) {
      return (
        <CurrentUser>
          {user => (
            <UpsertMutationComponent mutation={UPSERT_LABEL_MUTATION}>
              {upsertLabelMutation => (
                <>
                  <LoginModal
                    show={showLoginModal}
                    cancel={() => this.setShowLoginModal(false)}
                  />
                  <ThemedPresearchCard>
                    <ThemedPresearchHeader>
                      <PresearchTitle>{capitalize(label)}</PresearchTitle>
                    </ThemedPresearchHeader>
                    <PresearchContent style={{ overflowY: 'auto' }}>
                      <AddFacetCard
                        upsert={upsertLabelMutation}
                        submitFacet={this.handleNewFacetSubmit}
                        user={user}
                        showLogin={this.setShowLoginModal}
                      />
                    </PresearchContent>
                  </ThemedPresearchCard>
                </>
              )}
            </UpsertMutationComponent>
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
                        <PresearchTitle>{capitalize(label)}</PresearchTitle>
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
                            value: existingField,
                            onChange: (e, existingField) =>
                              this.handleExistingFieldChange(
                                e,
                                existingField,
                                apolloClient
                              ),
                          }}
                          onSuggestionSelected={(
                            event,
                            {
                              suggestion,
                              suggestionValue,
                              suggestionIndex,
                              method,
                            }
                          ) =>
                            this.onSuggestionSelected(
                              event,
                              {
                                suggestion,
                                suggestionValue,
                                suggestionIndex,
                                method,
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
