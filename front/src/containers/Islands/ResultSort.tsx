import React, { useRef } from 'react';
import useUrlParams from 'utils/UrlParamsProvider';
import {  updateSearchParamsAction } from 'services/search/actions'
import { AggFilterInput } from 'types/globalTypes';
import { BeatLoader } from 'react-spinners';
import { MenuItem, DropdownButton } from 'react-bootstrap';
import { RootState } from 'reducers';
import { SearchQuery, SearchParams } from '../SearchPage/shared';
import { SortInput } from 'types/globalTypes';
import { defaultPageSize } from '../SearchPage/Types';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from 'containers/ThemeProvider/ThemeProvider';


interface Props {
  islandId?: any;

}

function ResultSort(props: Props) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { islandId } = props

  const emptySet = new Set();
  const searchParamsCurrent = useRef({
    q: { key: 'AND', children: [] as SearchQuery[] },
    aggFilters: [] as AggFilterInput[],
    crowdAggFilters: [] as AggFilterInput[],
    sorts: [] as SortInput[],
    page: 0,
    pageSize: defaultPageSize

  })
  const islandConfig = useSelector((state: RootState) => state.search.islandConfig);

  let getCurrentIsland = () => {

    let jsonConfig = islandConfig
    return islandId && jsonConfig && jsonConfig[islandId]
  }


  const DEFAULT_CONFIG = {
    "sortables":[
       {
          "fieldName":"nct_id",
          "displayName":"NCT ID ▲",
          "desc":false
       },
       {
          "fieldName":"nct_id",
          "displayName":"NCT ID ▼",
          "desc":true
       }
    ]
 }
  const data = useSelector((state: RootState) => state.search.searchResults);
  const searchParams = data?.data?.searchParams;


  const dataParams = searchParams.searchParams

  searchParamsCurrent.current = dataParams;
  if (!data || !searchParams) {
    return <BeatLoader />
  }
  const sortHelper = (sorts) => {
    dispatch(updateSearchParamsAction({ ...searchParamsCurrent.current, sorts, page: 0 }));
  };
  let currentIsland = getCurrentIsland();
  console.log(currentIsland)
  
  let itemsArray = currentIsland ? currentIsland?.sortables : DEFAULT_CONFIG.sortables
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'row', marginLeft: 'auto' }}>
        <div style={{ display: 'flex' }}>
          <DropdownButton
            bsStyle="default"
            title={`Sort`}
            key="default"
            id="dropdown-basic-default"
            style={{
              width: '200px',
              background: theme && theme.button,
            }}>
            {itemsArray.map((field, index) => {
              let sorts = [{ id: field.fieldName, desc: field.desc }];
              return (
                <MenuItem
                  key={field + index}
                  name={field}
                  onClick={() => sortHelper(sorts)}>

                    {field.displayName}

                </MenuItem>
              );
            })}
          </DropdownButton>
        </div>
      </div>
    </>
  );
}
export default ResultSort;