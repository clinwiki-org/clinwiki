import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AggBucket } from '../SearchPage/Types';
import { FormControl } from 'react-bootstrap';
import { RootState } from 'reducers';
import { SiteViewFragment_search_aggs_fields } from 'services/site/model/SiteViewFragment';
import styled from 'styled-components';

interface DistanceDropDownOptionsProps {
  buckets: Array<AggBucket>;
  isSelected: () => boolean;
  distanceChanged: (e) => void;
  field: SiteViewFragment_search_aggs_fields;
  useDefaultRadius: () => void;
  zipcode: string;
  searchResultData: any;
  radius:string;
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

  const {
    buckets,
    field,
  } = props;


  let activeOptions: string[] = [];


  const checkOption = (bucket, field) => {
    if (props.isSelected()) {
      activeOptions.push(bucket);
      if (props.radius !== activeOptions[0]) {

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
        onChange={(e)=> props.distanceChanged(e)}>
        <option disabled value={-1} key={-1}>
          {`${props.radius} miles`}
        </option>
        {buckets.map(bucket => checkOption(bucket, field))}
      </StyledFormControl>
    </div>
  );
}

export default DistanceDropDownOptions;
