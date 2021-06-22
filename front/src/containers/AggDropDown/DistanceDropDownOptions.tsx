import React, { useEffect, useState } from 'react';
import { find, findIndex } from 'ramda';
import { useDispatch, useSelector } from 'react-redux';

import { AggBucket } from '../SearchPage/Types';
import { FormControl } from 'react-bootstrap';
import { RootState } from 'reducers';
import { SiteViewFragment_search_aggs_fields } from 'services/site/model/SiteViewFragment';
import styled from 'styled-components';
import { updateSearchParamsAction } from 'services/search/actions';

interface DistanceDropDownOptionsProps {
  buckets: Array<AggBucket>;
  isSelected: () => boolean;
  field: SiteViewFragment_search_aggs_fields;
  useDefaultRadius: () => void;
  zipcode: string;
  searchResultData: any;
}

interface DistanceDropDownOptionsState {
  zipcode?: string | null;
  radius?: string | null;
  lat: number | null;
  long: number | null;
}

const StyledFormControl = styled(FormControl)`
  margin-bottom: 20px;
  border-radius: 2px;
  border-color: 'red';
`;

function DistanceDropDownOptions(props:
  DistanceDropDownOptionsProps) {

  const data = useSelector((state: RootState) => state.search.searchResults);
  const searchParams = data?.data?.searchParams.searchParams;
  const dispatch = useDispatch()
  const [radius, setRadius] = useState('50');
  useEffect(() => {
    const aggSettings = find(
      (x) => x.field == "location",
      searchParams["aggFilters"]
    );
    setRadius(aggSettings?.radius || '50')
  }, [])
  const changeRadius = (radius) => {

    const aggSettings = find(
      (x) => x.field == "location",
      searchParams["aggFilters"]
    );

    if (!aggSettings) {
      let locationFilter = {
        field: "location",
        gte: null,
        lte: null,
        values: [],
        includeMissingFields: null,
        zipcode: null,
        radius: radius,
        lat: null,
        long: null,
      }

      searchParams['aggFilters'].push(locationFilter)
      let newParams = { ...searchParams, aggFilters: searchParams["aggFilters"] }
      dispatch(updateSearchParamsAction(newParams));
    }

    let index = findIndex((x) => x.field == "location", searchParams["aggFilters"])
    searchParams['aggFilters'][index].radius = radius
    let newParams = { ...searchParams, aggFilters: searchParams["aggFilters"] }
    dispatch(updateSearchParamsAction(newParams));

  }
  const removeFilter = (option: string) => {
  }

  const {
    buckets,
    field,
  } = props;


  let activeOptions: string[] = [];

  const changeDropDownOption = async e => {
    e.preventDefault();
    setRadius(e.target.value);
    changeRadius(
      e.target.value);

    activeOptions.forEach(o => {
      removeFilter(o);
    });
  };

  const checkOption = (bucket, field) => {
    if (props.isSelected()) {
      activeOptions.push(bucket);
      if (radius !== activeOptions[0]) {

        setRadius(activeOptions[0])
      }
    }

    return (
      <option key={bucket} value={bucket}>
        {`${bucket} miles`}
      </option>
    );
  };
  return (
    <div className="dropDownFacet">
      <StyledFormControl
        componentClass={'select'}
        value={-1}
        onChange={e => changeDropDownOption(e)}>
        <option disabled value={-1} key={-1}>
          {`${radius} miles`}
        </option>
        {buckets.map(bucket => checkOption(bucket, field))}
      </StyledFormControl>
    </div>
  );
}

export default DistanceDropDownOptions;
