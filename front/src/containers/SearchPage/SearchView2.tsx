import React, { useState, useEffect, useRef } from 'react';
import { SearchParams } from './shared';
import { ThemedButton, ThemedSearchContainer } from 'components/StyledComponents';
import styled from 'styled-components';
import * as FontAwesome from 'react-fontawesome';
import { BeatLoader } from 'react-spinners';
import { ButtonGroup, MenuItem, DropdownButton } from 'react-bootstrap';
import { CardIcon, TableIcon } from './components/Icons';
import { Helmet } from 'react-helmet';
import { SortInput } from 'types/globalTypes';
import { PresentSiteFragment_siteView } from 'types/PresentSiteFragment';
import {
  map,
  over,
  lensProp,
  fromPairs,
} from 'ramda';
import { snakeCase } from 'utils/helpers';
import { useQuery } from '@apollo/client';
import {
  SearchPageSearchQuery,
  SearchPageSearchQueryVariables,
} from 'types/SearchPageSearchQuery';
import 'react-table/react-table.css';
import { studyFields, MAX_WINDOW_SIZE } from 'utils/constants';
import MasonryCards from './components/MasonryCards';
import ListCards from './components/ListCards';
import withTheme from 'containers/ThemeProvider';
import TableRV from './components/TableRV';
import {
  AutoSizer,
} from 'react-virtualized';
import aggToField from 'utils/aggs/aggToField';
import useUrlParams from '../../utils/UrlParamsProvider';
import  SEARCH_PAGE_SEARCH_QUERY from 'queries/SearchPageSearchQuery';
import SEARCH_PAGE_SEARCH_QUERY_NO_RESULTS  from 'queries/SearchPageSearchQueryNoResults';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSearchStudies } from 'services/search/actions'
import {RootState} from 'reducers';

const SearchWrapper = styled.div`
  .rt-tr {
    cursor: default;
  }
  #search-sidebar {
    padding-right: 0;
  }
  height: 100%;
`;


interface SearchView2Props {
  onBulkUpdate: (hash: string, siteViewUrl: string) => void;
  onUpdateParams: (params: SearchParams) => SearchParams;
  onRowClick: (nctId: string, hash: string, siteViewUrl: string) => void;
  searchHash: string;
  searchParams: SearchParams;
  presentSiteView: PresentSiteFragment_siteView;
  theme: any;
}


const MemoizedSearchView = React.memo(function SearchView2(props: SearchView2Props) {
  const dispatch = useDispatch();
  const changeSorted = (sorts: [SortInput], params: SearchParams) => {
    const idSortedLens = lensProp('id');
    const snakeSorts = map(over(idSortedLens, snakeCase), sorts);
    const afterParams = { ...params, sorts: snakeSorts, page: 0 }
    return afterParams;
  };
  const queryString = useUrlParams();
  const params = props.searchParams;
  const renderViewDropdown = () => {
    const { presentSiteView } = props;
    const buttonsArray = presentSiteView.search.results.buttons.items.filter(
      button => button.target.length > 0 && button.icon.length > 0
    );
    if (presentSiteView && buttonsArray.length > 0) {
      return (
        <div style={{ marginLeft: 'auto' }}>
          <ButtonGroup>
            {buttonsArray.map((button, index) => (
              <a
                href={`/search?hash=${props.searchHash}&sv=${button.target}&pv=${queryString.pv}`}
                key={button.target + index}>
                <ThemedButton>
                  {renderViewButton(button.icon)}
                </ThemedButton>
              </a>
            ))}
          </ButtonGroup>
        </div>
      );
    }
    return null;
  };

  const renderViewButton = (icon: string) => {
    switch (icon) {
      case 'card':
        return <CardIcon />;
      case 'table':
        return <TableIcon />;
      case 'search':
        return <FontAwesome name="search" />;
      case 'list':
        return <FontAwesome name="th-list" style={{ fontSize: '1.8rem' }} />;
      case 'small masonry':
        return <FontAwesome name="th" style={{ fontSize: '1.8rem' }} />;
      case 'large masonry':
        return <FontAwesome name="th-large" style={{ fontSize: '1.8rem' }} />;
      case 'object':
        return (
          <FontAwesome name="object-group" style={{ fontSize: '1.8rem' }} />
        );
      case 'newspaper':
        return (
          <FontAwesome name="newspaper-o " style={{ fontSize: '1.8rem' }} />
        );
      default:
        return null;
    }
  };
  const renderHelper = (
    data,
    loading,
    template,
    onPress,
    resultsType,
  ) => {
    switch (resultsType) {
      case 'masonry':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginBottom: '10px',
              }}>
              {renderViewDropdown()}
              {renderFilterDropDown()}
            </div>

            <MasonryCards
              data={data}
              loading={loading}
              template={template}
            />

          </div>
        );
      case 'list':
        return (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginBottom: '10px',
              }}>
              {renderViewDropdown()}
              {renderFilterDropDown()}
            </div>
            <AutoSizer>
              {({ height, width }) => (
                <ListCards
                  data={data}
                  loading={loading}
                  template={template}
                  height={height}
                  width={width}
                />
              )}
            </AutoSizer>
          </div>
        );
      case 'table':
        return (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-emd',
                marginBottom: '10px',
              }}>
              {renderViewDropdown()}
              {renderFilterDropDown()}
            </div>
            <AutoSizer>
              {({ width }) => (
                <TableRV
                  data={data}
                  loading={loading}
                  template={template}
                  width={width}
                  columnFields={props.presentSiteView.search.fields}
                  onRowClick={props.onRowClick}
                />
              )}
            </AutoSizer>
          </div>
        );
      default:
        return (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <p>  Looks like you have an outdated view style configured.
            Please contact your site administrator.
            </p>
            <p>
              Defaulting to Card View:
             </p>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginBottom: '10px',
              }}>
              {renderViewDropdown()}
              {renderFilterDropDown()}
            </div>
            <MasonryCards
              data={data}
              loading={loading}
              template={template}
            />
          </div>
        );
    }
  };
  const renderSearch = (
    data, loading ) => {
    const { presentSiteView } = props;
    const showResults = presentSiteView.search.config.fields.showResults;
    let searchData = data?.search?.studies || [];
    const resultsType = presentSiteView.search.results.type;
    // if (error) {
    //   return <div>{error.message}</div>;
    // }
    if (!data) {
      return <BeatLoader />
    }
    return showResults ? (
      renderHelper(
        searchData,
        loading,
        presentSiteView.search.template,
        cardPressed,
        resultsType,
      )
    ) : (
        <div style={{ marginLeft: 'auto', display: 'flex', height: '100%' }}>
          {renderViewDropdown()}
        </div>
      );
  };
  const cardPressed = card => {
    props.onRowClick(
      card.nctId,
      props.searchHash,
      props.presentSiteView.url || 'default'
    );
  };


  const sortHelper = (sorts) => {
    const newParams = () => changeSorted(sorts, params)
    props.onUpdateParams(newParams());
  };
  const reverseSort = () => {
    let desc = params.sorts[0].desc;
    let newSort: [SortInput] = [
      { id: params.sorts[0].id, desc: !desc },
    ];
    const newParams = () => changeSorted(newSort, params)
    props.onUpdateParams(newParams());
  };
  const renderSortIcons = () => {
    let isDesc = params.sorts[0].desc;
    return (
      <div
        onClick={() => reverseSort()}
        style={{ display: 'flex', cursor: 'pointer' }}>
        {isDesc ? (
          <FontAwesome
            name={'sort-amount-desc'}
            style={{ color: props.theme.button, fontSize: '26px' }}
          />
        ) : (
            <FontAwesome
              name={'sort-amount-asc'}
              style={{ color: props.theme.button, fontSize: '26px' }}
            />
          )}
      </div>
    );
  };
  const renderFilterDropDown = () => {
    const sortField = () => {
      if (params.sorts.length > 0) {
        return aggToField(
          params.sorts[0].id,
          params.sorts[0].id
        );
      }
      return ' ';
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'row', marginLeft: 'auto' }}>
        <div style={{ display: 'flex' }}>
          <DropdownButton
            bsStyle="default"
            title={`Sort by: ${sortField()}`}
            key="default"
            id="dropdown-basic-default"
            style={{
              width: '200px',
              background: props.theme.button,
            }}>
            {props.presentSiteView.search.sortables.map((field, index) => {
              let sorts = [{ id: field, desc: false }];
              return (
                <MenuItem
                  key={field + index}
                  name={field}
                  onClick={() => sortHelper(sorts)}>
                  {aggToField(field, field)}
                </MenuItem>
              );
            })}
          </DropdownButton>
          {sortField() !== ' ' ? renderSortIcons() : null}
        </div>
      </div>
    );
  };
// SEARCH PAGE SEARCH QUERY 
useEffect(()=>{
  dispatch(fetchSearchStudies(params));
},[dispatch]);

const data = useSelector((state : RootState ) => state.search.studies);
const isLoading = useSelector((state : RootState ) => state.search.isFetchingStudies);
  // const result =  useQuery(SEARCH_PAGE_SEARCH_QUERY, {
  //   variables: params,
  // });
  // const { data, loading, error } = result;
  // console.log("DATA",data)
  if(data == undefined || isLoading) return <BeatLoader/>
  return (
    <SearchWrapper>
      {/* <Helmet>
        <title>Search</title>
        <meta name="description" content="Description of SearchPage" />
      </Helmet> */}
      {/* <Col md={12}> */}
      <div style={{ height: '100%' }}>
        <ThemedSearchContainer>
          {renderSearch(data.data, isLoading )}
        </ThemedSearchContainer>
      </div>
      {/* </Col> */}
    </SearchWrapper>
  );
})

export default withTheme(MemoizedSearchView);
