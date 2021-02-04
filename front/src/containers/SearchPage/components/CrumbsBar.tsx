import React,{useState} from 'react';
import {useDispatch,useSelector} from 'react-redux';
import { RootState } from 'reducers';
import {fetchSearchAutoSuggest} from 'services/search/actions';
import {
  Grid,
  Row,
  Col,
  Form,
  FormGroup,
  ControlLabel,
  ListGroup,
  ListGroupItem,
} from 'react-bootstrap';
import * as FontAwesome from 'react-fontawesome';
import { ApolloConsumer } from '@apollo/client';
import * as Autosuggest from 'react-autosuggest';
import styled from 'styled-components';
import aggToField from 'utils/aggs/aggToField';
import MultiCrumb from 'components/MultiCrumb';
import AggCrumb from 'components/MultiCrumb/AggCrumb';
import { BeatLoader } from 'react-spinners';
import { AggCallback, SearchParams } from '../Types';
import { isEmpty } from 'ramda';
import { PresentSiteFragment_siteView } from 'services/site/model/PresentSiteFragment';
import { displayFields } from 'utils/siteViewHelpers';
import withTheme, { Theme } from 'containers/ThemeProvider/ThemeProvider';
import {ThemedButton, ThemedSearchContainer} from 'components/StyledComponents/index';
import ExportToCsvComponent from './ExportToCsvComponent';
import AUTOSUGGEST_QUERY from 'queries/CrumbsSearchPageAggBucketsQuery';
import SaveSearch from './SaveSearch';
import LabeledButton from 'components/LabeledButton';
import {  SearchParams  as SearchParamsType }  from '../../../containers/SearchPage/shared';



const CrumbsBarStyleWrappper = styled.div`
  border: solid white 1px;
  // background-color: ${props => props.theme.crumbsBar.containerBackground};
  color: black;
  margin-left: 45px;
  margin-right: 45px;
  display: flex;
  flex-direction: column;
  padding: 10px;
  .container {
    border: 0px;
    width: 100% !important;
    margin-top: 5px;
    color: #394149;
  }
  .crumbs-bar {
    // background: ${props => props.theme.crumbsBar.containerBackground};
    color: ${props => props.theme.crumbsBar.containerFont};

    i {
      font-style: normal;
      margin-right: 3px;
      text-transform: capitalize;
    }

    span.label.label-default {
      padding: 7px !important;
      border-radius: 4px !important;
      display: flex;
      flex-wrap: wrap;
    }

    input.form-control {
      border: 0px;
      box-shadow: none;
      margin-right: 10px;
      margin-left: 10px;
    }

    span.label {
      background: #55b88d;
      padding: 5px;
      font-size: 12px;
      border-radius: 4px;
      margin-right: 5px;
      text-transform: capitalize;

      span.fa-remove {
        color: #fff !important;
        opacity: 0.5;
        margin-left: 5px !important;
      }

      span.fa-remove:hover {
        opacity: 1;
      }

      b {
        padding: 5px 1px 5px 1px;
      }

      b:last-of-type {
        padding-right: 0px;
      }
    }
  }
  .right-align {
    text-align: right;
  }

  div.row > div {
    padding-left: 0px;
  }

  .searchInput {
    padding-bottom: 10px;
  }
`;

const ThemedCrumbsBarStyleWrappper = withTheme(CrumbsBarStyleWrappper);

const LoaderWrapper = styled.div`
  margin: 20px 20px;

  text-align: center;
`;

interface CrumbsBarProps {
  searchParams: SearchParams;
  onBulkUpdate: (hash: string, siteViewUrl: string) => void;
  removeFilter: AggCallback;
  addFilter: AggCallback;
  addSearchTerm: (term: string) => void;
  removeSearchTerm: (term: string, bool?) => void;
  onReset: () => void;
  onClear: () => void;
  siteViewUrl?: string;
  presentSiteView: PresentSiteFragment_siteView;
  totalResults: number;
  searchHash: string;
  theme: Theme;
  updateSearchParams: (params: SearchParamsType) => void;
}

interface CrumbsBarState {
  searchTerm: string;
  suggestions: any;
  isSuggestionLoading: boolean;
}

//
// NEW CODE HERE
//

function* mkDefaultClearButtons (searchParams: SearchParams,props) {
  const totalLength =
    searchParams.q?.length +
    searchParams.crowdAggFilters?.length +
    searchParams.aggFilters?.length;
  if (totalLength > 0) {
    yield (
      <span key="buttons">
        <ThemedButton
          key="defaul"
          onClick={props.onReset}
          style={{ margin: '5px 0px 5px 10px', border: '1px solid white' }}>
          Default
        </ThemedButton>
        <ThemedButton
          key="reset"
          onClick={props.onClear}
          style={{ margin: '5px 0px 5px 10px', border: '1px solid white' }}>
          Clear
        </ThemedButton>
      </span>
    );
  } else {
    yield (
      <ThemedButton
        key="defaul"
        onClick={props.onReset}
        style={{ margin: '5px 0px 5px 10px', border: '1px solid white' }}>
        Default
      </ThemedButton>
    );
  }
}


function* mkCrumbs(searchParams: SearchParams, thisSiteView, props) {
  if (!isEmpty(searchParams.q)) {
    yield (
      <MultiCrumb
        key="Search"
        category="search"
        values={searchParams.q}
        onClick={term => props.removeSearchTerm(term)}
      />
    );
  }
  let aggFilterCounter = 0;
  for (const key in searchParams.aggFilters) {
    const agg = searchParams.aggFilters[key];
    yield (
      <AggCrumb
        grouping="aggFilters"
        agg={agg}
        key={`aggFilters${aggFilterCounter++}`}
        thisSiteView={thisSiteView}
        searchParams={props.searchParams}
        updateSearchParams={props.updateSearchParams}
      />
    );
  }
  for (const key in searchParams.crowdAggFilters) {
    const agg = searchParams.crowdAggFilters[key];
    const cat = aggToField(agg.field, agg.field);
    yield (
      <AggCrumb
        grouping="crowdAggFilters"
        category={cat}
        values={agg.values}
        agg={agg}
        key={`crowdAggFilters${aggFilterCounter++}`}
        thisSiteView={thisSiteView}
        searchParams={props.searchParams}
        updateSearchParams={props.updateSearchParams}
      />
    );
  }
}

const CrumbsBar = (props: CrumbsBarProps) => {
  const dispatch = useDispatch();
  const { presentSiteView, searchParams } = props;
  const user = useSelector( (state: RootState) => state.user.current);
  
  const isFetchingAutoSuggest = useSelector( (state:RootState) => state.search.isFetchingAutoSuggest);
  const suggestions = useSelector( (state:RootState) => state.search.suggestions);

  const [searchTerm,setSearchTerm] = useState('');
  
  let showCrumbsBar = presentSiteView.search.config.fields.showBreadCrumbs;
  let showAutoSuggest = presentSiteView.search.config.fields.showAutoSuggest;


  const isLoading = useSelector((state : RootState ) => state.search.isFetchingAggs);
  const getAggFieldsFromSubsiteConfig = aggs => {
    let aggFields: string[] = [];
    if (aggs.length > 0) {
      aggs.map(i => {
        if (i.autoSuggest) {
          aggFields.push(i.name);
        }
      });
    }
    if (aggFields.length <= 0) {
      aggFields = [
        'browse_condition_mesh_terms',
        'browse_interventions_mesh_terms',
        'facility_countries',
      ];
    }
    return aggFields;
  };

  const getCrowdAggAutoSuggest = () => {
    let crowdAggFields = displayFields(
      props.presentSiteView.search.autoSuggest.crowdAggs.selected.kind,
      props.presentSiteView.search.autoSuggest.crowdAggs.selected.values,
      props.presentSiteView.search.autoSuggest.crowdAggs.fields
    );
    let fieldsToReturn: any[] = [];
    crowdAggFields.map(field => {
      fieldsToReturn.push(field.name);
    });
    return fieldsToReturn;
  };

  const getAutoSuggestFields = () => {
    let aggFields = displayFields(
      props.presentSiteView.search.autoSuggest.aggs.selected.kind,
      props.presentSiteView.search.autoSuggest.aggs.selected.values,
      props.presentSiteView.search.autoSuggest.aggs.fields
    );
    let fieldsToReturn: any[] = [];
    aggFields.map(field => {
      fieldsToReturn.push(field.name);
    });
    return fieldsToReturn;
  };

  const queryAutoSuggest = () => {    
    const { searchParams, presentSiteView } = props;
    const newParams = searchParams.q.map(i => {
      return { children: [], key: i };
    });

    const aggFields = getAutoSuggestFields();

    const crowdAggFields = getCrowdAggAutoSuggest();

    const query = AUTOSUGGEST_QUERY;
    const variables = {
      agg: 'browse_condition_mesh_terms',
      aggFilters: searchParams.aggFilters,
      aggOptionsFilter: searchTerm,
      crowdAggFilters: searchParams.crowdAggFilters,
      page: 0,
      pageSize: 5,
      url: presentSiteView.url,
      q: {
        children: newParams,
        key: 'AND',
      },
      sorts: [],
      aggFields: aggFields,
      crowdAggFields: crowdAggFields,
    };
    dispatch(fetchSearchAutoSuggest(variables));
    // const response = await apolloClient.query({
    //   query,
    //   variables,
    // });
    // const array = response.data.autocomplete.autocomplete;
    // setSuggestions(array);
    // setSuggestionLoading(false);
  };

  // const onSuggestionsFetchRequested = () => {
  //   setSuggestionLoading(true);
  // };

  // const onSuggestionsClearRequested = () => {
  //   setSuggestions([]);
  //   setSuggestionLoading(true);
  // };

  const getSuggestionValue = suggestion => {
    return suggestion.key;
  };
  const renderAutoSuggest = (
    searchTerm,
    showAutoSuggest
  ) => {
    if (showAutoSuggest === true) {
      return (
        <div style={{ display: 'inline' }}>
          <FormGroup>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
              }}>
              <b
                style={{
                  marginRight: '8px',
                  marginTop: '4px',
                }}>
                <ControlLabel>Search Within: </ControlLabel>{' '}
              </b>

              <Autosuggest
                multiSection={true}
                suggestions={suggestions}
                inputProps={{
                  value: searchTerm,
                  onChange: (e, searchTerm) =>
                    onChange(e, searchTerm),
                }}
                renderSuggestion={renderSuggestion}
                renderSuggestionsContainer={
                  isFetchingAutoSuggest ? renderSuggestionsContainer : undefined
                }
                renderSectionTitle={renderSectionTitle}
                getSectionSuggestions={getSectionSuggestions}
                onSuggestionSelected={onSuggestionSelected}
                getSuggestionValue={getSuggestionValue}
                onSuggestionsFetchRequested={ () => {} }
                onSuggestionsClearRequested={ () => {} }
              />
            </div>
          </FormGroup>
          <LabeledButton
          theType={"Submit"}
          helperText={"Search"}
          iconName={"search"}
       />
        </div>
      );
    } else if (showAutoSuggest === false) {
      return null;
    }
  };

  const renderSuggestion = suggestion => {
    const capitalized = capitalize(suggestion.key);
    return <span>{`${capitalized} (${suggestion.docCount})`}</span>;
  };

  const renderSuggestionsContainer = () => {
    if (isFetchingAutoSuggest === true) {
      if (suggestions.length === 0) {
        return null;
      } else {
        return (
          <div className="react-autosuggest__suggestions-container--open">
            <LoaderWrapper>
              <BeatLoader color="#cccccc" />
            </LoaderWrapper>
          </div>
        );
      }
    }
  };

  const getSectionSuggestions = section => {
    return section.results;
  };

  const capitalize = str => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const onSuggestionSelected = (event, { suggestionValue, sectionIndex }) => {
    const section : any = suggestions[sectionIndex];
    if (section.isCrowd) {
      props.addFilter(section.name, suggestionValue, true);
    } else props.addFilter(section.name, suggestionValue);
  };

  const renderSectionTitle = section => {
    if (section.results.length > 0) {
      let newName = aggToField(section.name, section.name);
      newName = capitalize(newName);
      return <strong>{newName}</strong>;
    } else return null;
  };

  const onChange = (e, { newValue }) => {
    setSearchTerm(newValue);
    queryAutoSuggest();
  };

  const clearPrimarySearch = () => {
    props.removeSearchTerm('', true);
  };
  const onSubmit = e => {
    e.preventDefault();
    props.addSearchTerm(searchTerm);
    setSearchTerm('');
  };

  const showSaveSearchButton = () => {
    const {searchParams } = props;
    if (
      searchParams.q &&
      searchParams.aggFilters &&
      searchParams.crowdAggFilters
    ){
      if (
        searchParams.q.length != 0 ||
        searchParams.aggFilters.length != 0 ||
        searchParams.crowdAggFilters.length != 0
      ) {
        return (
          <SaveSearch
            user={user}
            siteView={props.presentSiteView}
            searchHash={props.searchHash}
          />
        );
      } 
     return null
    }
    return null
  }  
  return (
    <Grid className="crumbs-bar">
      {showCrumbsBar ? (
        <Row>
          <Col
            md={12}
            style={{
              padding: '10px 0px',
              display: 'flex',
              flexWrap: 'wrap',
            }}>
            <ListGroup
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                border: '1px solid #ddd',
                borderRadius: '5px',
                background: '#fff',
                width: '100%',
              }}>
              <ListGroupItem
                style={{
                  minWidth: '100%',
                  background: props.theme.button,
                  color: '#fff',
                }}>
                {presentSiteView.search.crumbs.search ? (
                  <Form
                    inline
                    className="searchInput"
                    onSubmit={onSubmit}
                    style={{ color: 'black', display: 'inline' }}>
                    {renderAutoSuggest(
                      searchTerm,
                      showAutoSuggest
                    )}
                  </Form>
                ) : null}{' '}
                {Array.from(
                  mkDefaultClearButtons(
                    props.searchParams,props
                  )
                )}
              </ListGroupItem>
                {Array.from(
                    mkCrumbs(
                      props.searchParams,
                      presentSiteView,
                      props
                    )
                  )}
            </ListGroup>
          </Col>
        </Row>
      ) : null}
      <Row>
        <Col xs={12}>
          <div style={{ marginRight: '10px', display: 'inline' }}>
            <b>Total Results:</b>{' '}
            {isLoading ? (<span style={{display:'inline-table', width: '5em'}}><BeatLoader/></span>): `${props.totalResults} studies`}
          </div>
          {
            showSaveSearchButton()
          }
          <ExportToCsvComponent
            siteView={props.presentSiteView}
            searchHash={props.searchHash}
          />
          {user && user.roles.includes('admin') ? (
            <ThemedButton
              onClick={() =>
                props.onBulkUpdate(
                  props.searchHash,
                  props.presentSiteView.url || 'default'
                )
              }
              style={{ marginLeft: '10px' }}>
              Bulk Update <FontAwesome name="truck" />
            </ThemedButton>
          ) : null}
        </Col>
      </Row>
    </Grid>
  );
}

export default withTheme(CrumbsBar);
