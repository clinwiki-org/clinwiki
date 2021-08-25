import React, { useState } from 'react';
import { FormControl } from 'react-bootstrap';
import { AggBucket } from '../SearchPage/Types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { updateBucketsState } from 'services/search/actions'
import InfiniteScroll from 'react-infinite-scroller';
import { fetchSearchPageAggBuckets } from 'services/search/actions';
import { length, reject, propEq } from 'ramda';
import useUrlParams from 'utils/UrlParamsProvider';
import SortKind from 'containers/AggDropDown/SortKind';
import styled from 'styled-components';
import { SearchQuery } from '../SearchPage/shared';
import { updateSearchParamsAction } from 'services/search/actions';

const SearchBox = styled.div`
  display: block;
  width: auto;
  margin-right: 200px;
  position: relative;
  background-color: white;
`
const ButtonBox = styled.div`
  display: block;
  float: right;
  width: 200px;
`

const ButtonLarge = styled.button`
  width: 100%;
  height: 60px;
  font-size: 218.75%;
  display: inline-block;
  box-sizing: border-box;
  text-transform: uppercase;
  outline: none;
  background-color: #5786AD;
  transition: background-color 0.4s cubic-bezier(0, 0, 1, 1) 0s, box-shadow 0.2s cubic-bezier(0, 0, 1, 1) 0s;
  box-shadow: 0px 0px 0px 0px rgb(0 0 0 / 40%);
  opacity: 1;
  border: 0px none;
  padding: 5px 30px;
  position: relative;
  line-height: 120%;
  font-weight: normal;
  color: white;
  letter-spacing: 1px;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    box-shadow: 0 0 10px 0 #6BA5D6 inset, 0 0 10px 0px #6BA5D6;
  }
`

const AutoCompleteWrapper = styled.div`
  top: 60px;
  max-width: 1000px;
  background: white;
  box-shadow: 0px 0px 1px #555;
  position: absolute;
  width: 100%;
`

const DisAutocompleteLoading = styled.li`
  text-align: center !important;
  color: #8c8c8c;
  width: 75%;
  margin: auto;
  padding: 30px;
  border-top: 1px solid transparent;
  position: relative;
  display: block;
  list-style-image: none;
`

const SearchText = styled.span`
  display: block;
  font-size: 1.2em;
  margin-top: 5px;
`

const DisAutoCompleteAutoCorrect = styled.div`
  padding: 10px 20px;
  font-size: 85%;
  line-height: 1.6;
`
const StrongTerm = styled.span`
  color: black;
  font-weight: bold;
`

const ResultItem = styled.li`
  display: block;
  padding: 0px;
  list-style-image: none;
`

const ResultLink = styled.a`
  display: block;
  padding: 10px 20px;
  color: #01127f;
  text-decoration: underline;
  outline: none;
  cursor: pointer;
  background: transparent !important;
  border: 0px none;
  border-radius: 0px;
`

const SearchAutoComplete = styled.ul`
  position: relative;
  display: block;
  border-radius: 0px;
  border: 0px none;
  background: transparent;
  z-index: 11;
  top: 0px;
  left: 0px;
  width: 100%;
  margin: 0px;
  padding: 0px;
`

const DisAutocompleteCloseResult = styled.a`
  position: relative;
  display: block;
  text-align: right;
  padding: 10px 20px 10px;
  text-decoration: none;
  color: #01093d;
  font-family: RockwellLight;
  font-size: 125%;  
`

const ButtonsContainer = styled.div`
  padding: 10px 10px;
  background-color: #f4f4f4;
  overflow: hidden;
  height: 46px;
`

const ShowingContainer = styled.span`
  line-height: 1.8em;
`

const NoResult = styled.li`
  text-align: center;
  color: #8c8c8c;
  width: 75%;
  margin: auto;
  padding: 30px;
  border-top: 1px solid transparent;
  position: relative;
  display: block;
  padding: 0px;
  list-style-image: none;
`

const TextContainer = styled.span`
  display: block;
  font-size: 1.2em;
  margin-top: 10px;
`

const InfiniteScrollContainer = styled.div`
  overflow: auto;
`

const PaginatorContainerLeft = styled.a`
  width: 30px;
  background-color: white;
  border: 1px solid #eeeeee;
  color: #f4f4f4;
  float: left;
  font-size: 21px;
  line-height: 1;
  margin-right: 1px;
  padding-left: 8px;
  padding-top: 2px;
`

const PaginatorContainerRight = styled.a`
  width: 30px;
  background-color: white;
  border: 1px solid #eeeeee;
  color: #f4f4f4;
  float: left;
  font-size: 21px;
  line-height: 1;
  margin-right: 10px;
  padding-right: 8px;
  padding-top: 2px;
`

interface InputFilterProps {
  buckets: Array<AggBucket>;
  inputFilter: string;
  aggId?: string;
  selectItem: any;
}

function InputFilter(props: InputFilterProps) {
  const dispatch = useDispatch();
  const { aggId } = props;
  const [inputFilter, setInputFilter] = useState('')
  const [displaySearch, setDisplaySearch] = useState(false)
  const [loading, setLoading] = useState(false)
  const aggBuckets = useSelector((state: RootState) => state.search.aggBuckets);
  const isFetchingCurrentAggBucket = useSelector((state: RootState) => state.search.aggBucketFilter?.isFetchingCurrentAggBucket);
  const totalResults = useSelector((state: RootState) => state.search.aggBuckets?.aggs[`${aggId}`]?.length);
  const data = useSelector((state: RootState) => state.search.searchResults);
  const searchParams = data?.data?.searchParams.searchParams;
  const PAGE_SIZE = 25;
  const getFullPagesCount = buckets => Math.floor(length(buckets) / PAGE_SIZE);
  const aggBucketsFilter = useSelector((state: RootState) => state.search.aggBucketFilter);
  const islandConfig = useSelector((state: RootState) => state.search.islandConfig);
  const isUpdatingParams = useSelector((state: RootState) => state.search.isUpdatingParams);
  let getCurrentAgg = () => {
    let jsonConfig = islandConfig
    return aggId && jsonConfig[aggId]
  }
  const paramsUrl = useUrlParams();
  let currentAgg = getCurrentAgg();
  const buckets = aggBuckets?.aggs[aggId!] || []
  const desc = currentAgg?.order?.desc
  const sortKind = currentAgg?.order?.sortKind == "count" ? SortKind.Number : SortKind.Alpha

  const handleInputFilterChange = (value: string) => {
    if (!value) {
      setLoading(true)
    } else {
      setLoading(false)
    }
    aggId && dispatch(updateBucketsState(aggId, {
      bucketFilter: value,
    }));
  };

  const handleLoadMoreHelper = () => {
    const variables = {
      ...searchParams,
      url: paramsUrl.sv,
      configType: 'presearch',
      returnAll: false,
      agg: currentAgg.aggKind == "crowdAggs" ? `fm_${currentAgg.name}` : currentAgg.name,
      pageSize: PAGE_SIZE,
      page: getFullPagesCount(buckets) + 1,
      aggOptionsFilter: props.aggId && aggBucketsFilter && aggBucketsFilter[props.aggId] && aggBucketsFilter[props.aggId].bucketFilter || "",
      aggOptionsSort: [{ id: sortKind == 1 ? "count" : "key", desc: desc }],
      q: searchParams.q,
      aggBucketsWanted: currentAgg.visibleOptions,
    };
    dispatch(fetchSearchPageAggBuckets(variables, props.aggId));
  }

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

  const handleSubmit = (e) => {
    e.preventDefault();
    newAddSearchTerm(inputFilter)
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <ButtonBox><ButtonLarge type="submit" className="default">Search</ButtonLarge></ButtonBox>
        <SearchBox>
          <FormControl
            type="text"
            placeholder="Enter a disease name to search..."
            autoComplete="off"
            value={inputFilter}
            onChange={(e) => {
              setDisplaySearch(true)
              setInputFilter(e.target.value)
              handleInputFilterChange(e.target.value)
            }}
            style={{ flex: 4, marginTop: '4px' }}
          ></FormControl>
        </SearchBox>
      </form>
      {
        displaySearch &&
        <AutoCompleteWrapper>
          <InfiniteScrollContainer style={totalResults === 0 || loading ? { height: '185px' } : { height: '350px' }}>
            <InfiniteScroll
              pageStart={0}
              loadMore={handleLoadMoreHelper}
              initialLoad={false}
              hasMore={true || false}
              useWindow={false}
            >
              {loading &&
                <>
                  <DisAutocompleteLoading>
                    <span className="fa fa-info-circle fa-3x"></span>
                    <br />
                    <SearchText>Please type a disease name to search ... </SearchText>
                  </DisAutocompleteLoading>
                  <DisAutocompleteCloseResult href="#" title="close">Close LiveSearch
                    <span className="fa fa-arrow-circle-up"></span>
                  </DisAutocompleteCloseResult>
                </>}
              {!loading &&
                <>
                  <DisAutoCompleteAutoCorrect>
                    <span className="wrapper">Showing results for&nbsp;
                      <StrongTerm>{inputFilter}</StrongTerm>:
                    </span>
                  </DisAutoCompleteAutoCorrect>
                  <SearchAutoComplete role="listbox" aria-activedescendant="ui-active-menuitem" >
                    {isFetchingCurrentAggBucket &&
                      <DisAutocompleteLoading>
                        <span className="searchText">Fetching Results </span>
                      </DisAutocompleteLoading>
                    }

                    {aggBuckets?.aggs[`${aggId}`].map((dis, index) =>
                      <ResultItem key={index}>
                        <ResultLink onClick={() => {
                          props.selectItem({ key: dis.key })
                        }}>


                          <p>{dis.key} ({dis.docCount})</p>
                        </ResultLink>
                      </ResultItem>
                    )}

                    {totalResults === 0 && isFetchingCurrentAggBucket === false &&
                      <NoResult>
                        <span className="fa fa-exclamation-triangle fa-3x"></span>
                        <TextContainer><strong>No matches were found</strong>. Try modifying your search.</TextContainer>
                        <br />
                      </NoResult>}

                    <DisAutocompleteCloseResult href="#" title="close">Close LiveSearch&nbsp;
                      <span className="fa fa-arrow-circle-up"></span>
                    </DisAutocompleteCloseResult>
                    {totalResults !== 0 &&
                      <div className="dis-autocomplete-bottom">
                        <ButtonsContainer>
                          <ShowingContainer> {totalResults || 0} results found. Showing 1 to {totalResults || 1} </ShowingContainer>
                          <PaginatorContainerLeft id="dis-autocomplete-paginate-previous" href="#" className="paginator_next left disabled"><span className="fa fa-angle-left"></span></PaginatorContainerLeft>
                          <PaginatorContainerRight id="dis-autocomplete-paginate-next" href="#" className="right"><span className="fa fa-angle-right"></span></PaginatorContainerRight>
                        </ButtonsContainer>
                      </div>}
                  </SearchAutoComplete>
                </>
              }
            </InfiniteScroll>
          </InfiniteScrollContainer>
        </AutoCompleteWrapper>
      }
    </>
  );
}

export default InputFilter;
