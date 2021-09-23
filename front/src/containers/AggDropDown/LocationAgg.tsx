import React, { useEffect, useState } from 'react';
import { FieldDisplay } from '../../services/site/model/InputTypes';
import { SiteViewFragment_search_aggs_fields } from 'services/site/model/SiteViewFragment';
import { AggBucket, AggregateAggCallback } from '../SearchPage/Types';
import { FormControl, FormGroup } from 'react-bootstrap';
import ThemedButton from 'components/StyledComponents/index';
import DistanceDropDownOptions from './DistanceDropDownOptions';
import LabeledButton from 'components/LabeledButton';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { find, findIndex } from 'ramda';
import { updateSearchParamsAction } from 'services/search/actions';

interface LocationAggProps {
  field: SiteViewFragment_search_aggs_fields | any;
  buckets: Array<AggBucket>;
  isSelected: () => boolean;
  removeFilters: AggregateAggCallback | undefined;
  agg: string;
  handleLocation: ([]) => void
}
interface LocationAggState {
  zipcode?: string | null,
  radius?: string | null,
  lat: number | null,
  long: number | null,
}

function LocationAgg(props: LocationAggProps) {

  const data = useSelector((state: RootState) => state.search.searchResults);
  const searchParams = data?.data?.searchParams.searchParams;
  const dispatch = useDispatch()
  const [zipcode, setZip] = useState("");
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);
  const [radius, setRadius] = useState('50');

  useEffect(() => {
    const aggSettings = find(
      (x) => x.field == "location",
      searchParams["aggFilters"]
    );
    if (aggSettings) {
      setZip(aggSettings.zipcode);
      setLat(aggSettings.lat);
      setLong(aggSettings.long);
      setRadius(aggSettings.radius);
    }
  }, [])
  const newChangeDistance = (positionData: any[]) => {

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
        zipcode: positionData[0],
        radius: positionData[3],
        lat: positionData[1],
        long: positionData[2],
      }

      searchParams['aggFilters'].push(locationFilter)
      let newParams = { ...searchParams, aggFilters: searchParams["aggFilters"] }
      dispatch(updateSearchParamsAction(newParams));
    }
    let index = findIndex((x) => x.field == "location", searchParams["aggFilters"])
    searchParams['aggFilters'][index] = {
      field: "location",
      gte: null,
      lte: null,
      values: [],
      includeMissingFields: null,
      zipcode: positionData[0],
      radius: positionData[3],
      lat: positionData[1],
      long: positionData[2],
    }
    let newParams = { ...searchParams, aggFilters: searchParams["aggFilters"] }
    dispatch(updateSearchParamsAction(newParams));

  }



  const showLocation = (position) => {
    setZip("");
    setLat(position.coords.latitude);
    setLong(position.coords.longitude);
    //     this.setState({ lat: position.coords.latitude, long: position.coords.longitude, zipcode: null, radius: this.state.radius },
    newChangeDistance([
      null,
      position.coords.latitude,
      position.coords.longitude,
      radius,
    ])
    props.handleLocation([
      null,
      position.coords.latitude,
      position.coords.longitude,
      radius,
    ])
  }
  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showLocation)
    }
  }
  const handleZipcode = () => {
    newChangeDistance([
      zipcode,
      null,
      null,
      radius,
    ])
    props.handleLocation([
      zipcode,
      null,
      null,
      radius,
    ])
  }
  const {
    field,
    isSelected,
    removeFilters,
    agg
  } = props;
  
  const buckets: number[] = [25, 50, 100, 250, 500, 1000, 2500, 3500]

  return (
    <>
      <FormGroup style={{ marginTop: '1.5em' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            borderBottom: 'solid 2px #ddd',
            alignItems: 'center',
          }}>
          <div
            style={{
              flex: 2,
              justifyContent: 'space-around',
              alignItems: 'center',
              display: 'flex',
            }}>
            <LabeledButton
              helperText={"Use Current Location"}
              theClick={handleCurrentLocation}
              iconName={"compass"}
            />
          </div>
          <FormControl
            type="text"
            placeholder="Enter Zip Code"
            value={zipcode}
            onChange={e => setZip(e.target.value)}
            onBlur={() => handleZipcode()
            }
            style={{ flex: 4, margin: '4px' }}
          />
        </div>


        <DistanceDropDownOptions
          removeFilters={removeFilters}
          display={(field && field.display) || FieldDisplay.STRING}
          //@ts-ignore
          buckets={buckets}
          isSelected={isSelected}
          field={field}
          agg={agg}
          zipcode={zipcode}
        />
      </FormGroup>
      <FormGroup>
        {/* this is a placebo, it's really done on onblur */}
        <ThemedButton type="submit">Enter</ThemedButton>
      </FormGroup>
    </>
  );
}


export default LocationAgg;