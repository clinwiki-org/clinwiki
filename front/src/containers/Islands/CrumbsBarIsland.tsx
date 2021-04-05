import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';
import styled from 'styled-components';
import useUrlParams from 'utils/UrlParamsProvider';
import * as Autosuggest from 'react-autosuggest';
import LabeledButton from 'components/LabeledButton';
import { displayFields } from 'utils/siteViewHelpers';
// import AUTOSUGGEST_QUERY from 'queries/CrumbsSearchPageAggBucketsQuery';
// import { fetchSearchAutoSuggest } from 'services/search/actions';
import { fetchSearchParams, updateSearchParamsAction } from 'services/search/actions';
import aggToField from 'utils/aggs/aggToField';
import { Form, FormGroup, ControlLabel } from 'react-bootstrap';
import { BeatLoader } from 'react-spinners';
import { SearchParams, SearchQuery } from '../SearchPage/shared';
import MultiCrumb from '../../components/MultiCrumb';
import { map, dissoc, propEq, reject } from 'ramda';
import { preselectedFilters } from 'utils/siteViewHelpers';
import { defaultPageSize } from '../SearchPage/Types';
import { AggFilterInput, SortInput } from 'types/globalTypes';
import {
  SearchPageParamsQuery_searchParams,
} from '../../services/search/model/SearchPageParamsQuery';
import { SiteViewFragment } from 'services/site/model/SiteViewFragment';
import AggCrumb from 'components/MultiCrumb/AggCrumb';
import { isEmpty, prop } from 'ramda';
import {
  Grid,
  Row,
  Col,
  ListGroup,
  ListGroupItem,
} from 'react-bootstrap';
const LoaderWrapper = styled.div`
  margin: 20px 20px;
  text-align: center;
`;
const DEFAULT_PARAMS: SearchParams = {
  q: { children: [], key: 'AND' },
  aggFilters: [],
  crowdAggFilters: [],
  sorts: [],
  page: 0,
  pageSize: defaultPageSize,
};

interface Props {
}

export default function CrumbsBarIsland(props: Props) {

  const searchParamsFromQuery = (
    params: SearchPageParamsQuery_searchParams | null | undefined,
    view: SiteViewFragment
  ): SearchParams => {
    const defaultParams = {
      ...DEFAULT_PARAMS,
      ...preselectedFilters(view),
    };
    if (!params) return defaultParams;

    const q = params.q
      ? (JSON.parse(params.q) as SearchQuery)
      : defaultParams.q;

    const aggFilters = map(
      dissoc('__typename'),
      params.aggFilters || []
    ) as AggFilterInput[];
    const crowdAggFilters = map(
      dissoc('__typename'),
      params.crowdAggFilters || []
    ) as AggFilterInput[];
    const sorts = map(dissoc('__typename'), params.sorts || []) as SortInput[];
    return {
      aggFilters,
      crowdAggFilters,
      sorts,
      q,
      //page and pageSize no longer exists since it was removed from the shortlink hash
      //defaulting to page 0 and defaultPageSize(100) to recieve the first 100 results for
      page: 0,
      pageSize: defaultPageSize,
    };
  };

  const queryString = useUrlParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.current);
  const data = useSelector((state: RootState) => state.search.searchResults);

  const isFetchingAutoSuggest = useSelector((state: RootState) => state.search.isFetchingAutoSuggest);
  const suggestions = useSelector((state: RootState) => state.search.suggestions);

  const [searchTerm, setSearchTerm] = useState('');


  const site = useSelector((state: RootState) => state.site.presentSiteProvider.site)
  const presentSiteView = site?.siteView;
  const searchParams = searchParamsFromQuery(
    data?.data?.searchParams,
    presentSiteView
  );
  //TO-DO, currently hardcoding previously reading from siteview config. Not sure which direction we're going 
  // let showCrumbsBar = presentSiteView.search.config.fields.showBreadCrumbs;
  // let showAutoSuggest = presentSiteView.search.config.fields.showAutoSuggest;
  let showCrumbsBar = true;
  let showAutoSuggest = true;
  const isUpdatingParams = useSelector((state: RootState) => state.search.isUpdatingParams);


  useEffect(() => {
    !data && dispatch(fetchSearchParams(queryString.hash));
  }, [dispatch]);

  const newAddSearchTerm = (term: string) => {
    if (!term.replace(/\s/g, '').length) {
      return
    }
    let newQ = { children: [{ key: term }], key: searchParams.q.key || "AND" }

    const children: SearchQuery[] = reject(propEq('key', term), searchParams.q.children || []);
    newQ = { ...searchParams.q, children: [...(children || []), { children: [], key: term }] as SearchQuery[] }
    let currentRams = {
      ...searchParams,
      q: newQ
    }
    !isUpdatingParams && dispatch(updateSearchParamsAction(currentRams));
  }

  function* mkCrumbs(searchParams: SearchParams, thisSiteView, props) {

    const q: string[] =
    searchParams?.q.key === '*'
      ? []
      : (searchParams?.q.children || []).map(prop('key'));

  const handledParams = {
    ...searchParams!,
    q,
  };
    if (!isEmpty(handledParams.q)) {
      console.log(searchParams)
      yield (
        <MultiCrumb
          key="Search"
          category="search"
          values={handledParams.q }
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

  //AUTOSUGGEST Still needs some love to get it working believe issue is in the queryAutoSuggest()
  const getAutoSuggestFields = () => {
    let aggFields = displayFields(
      presentSiteView.search.autoSuggest.aggs.selected.kind,
      presentSiteView.search.autoSuggest.aggs.selected.values,
      presentSiteView.search.autoSuggest.aggs.fields
    );
    let fieldsToReturn: any[] = [];
    aggFields.map(field => {
      fieldsToReturn.push(field.name);
    });
    return fieldsToReturn;
  };

  const getCrowdAggAutoSuggest = () => {
    let crowdAggFields = displayFields(
      presentSiteView.search.autoSuggest.crowdAggs.selected.kind,
      presentSiteView.search.autoSuggest.crowdAggs.selected.values,
      presentSiteView.search.autoSuggest.crowdAggs.fields
    );
    let fieldsToReturn: any[] = [];
    crowdAggFields.map(field => {
      fieldsToReturn.push(field.name);
    });
    return fieldsToReturn;
  };

  const getSuggestionValue = suggestion => {
    return suggestion.key;
  };
  const getSectionSuggestions = section => {
    return section.results;
  };

  const capitalize = str => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const onSuggestionSelected = (event, { suggestionValue, sectionIndex }) => {
    const section: any = suggestions[sectionIndex];
    if (section.isCrowd) {
      console.log("add selection")
      // props.addFilter(section.name, suggestionValue, true);
    } else console.log("else, suggestion selected")
    // props.addFilter(section.name, suggestionValue);
  };

  const renderSectionTitle = section => {
    if (section.results.length > 0) {
      let newName = aggToField(section.name, section.name);
      newName = capitalize(newName);
      return <strong>{newName}</strong>;
    } else return null;
  };

  const onChange = (e, { newValue }) => {
    console.log(e, newValue)
    setSearchTerm(newValue);

    // queryAutoSuggest();
  };

  const onSubmit = e => {
    e.preventDefault();
    console.log("ADD", searchTerm)
    newAddSearchTerm(searchTerm);
    setSearchTerm('');
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
                onSuggestionsFetchRequested={() => { }}
                onSuggestionsClearRequested={() => { }}
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
  // let crumbValues: string[] = [];
  // searchParams.q.children.map(v=>{
  //   crumbValues.push(v.key)
  // });

  return (
        <div style={{display: "grid"}}>
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
                        {Array.from(
                                      mkCrumbs(
                                        searchParams,
                                        presentSiteView,
                                        props
                                      )
                                    )}
                  </ListGroup>
              </Col>
        </div>

  );
};
