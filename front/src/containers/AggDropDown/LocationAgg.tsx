import React, { useEffect, useState } from 'react';
import { FieldDisplay } from '../../services/site/model/InputTypes';
import { SiteViewFragment_search_aggs_fields } from 'services/site/model/SiteViewFragment';
import { AggBucket, AggregateAggCallback } from '../SearchPage/Types';
import { FormControl, FormGroup, InputGroup, Button } from 'react-bootstrap';
import ThemedButton from 'components/StyledComponents/index';
import DistanceDropDownOptions from './DistanceDropDownOptions';
import LabeledButton from 'components/LabeledButton';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { find, findIndex } from 'ramda';
import { updateSearchParamsAction } from 'services/search/actions';
import * as FontAwesome from 'react-fontawesome';


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
      (x) => x.field == "locations",
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
      (x) => x.field == "locations",
      searchParams["aggFilters"]
    );
    if (!aggSettings) {
      let locationFilter = {
        field: "locations",
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
    let index = findIndex((x) => x.field == "locations", searchParams["aggFilters"])
    searchParams['aggFilters'][index] = {
      field: "locations",
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

const handleDistanceChanged = (e) =>{
  setRadius(e.target.value)
}

  const showLocation = (position) => {
    setZip("");
    setLat(lat !== position.coords.latitude? position.coords.latitude: null );
    setLong(long !== position.coords.longitude?  position.coords.longitude: null);
  }
  const submitLocation = () =>{
    if(zipcode == ""){
      newChangeDistance([
        null,
        lat,
        long,
        radius,
      ])
      props.handleLocation([
        null,
       lat,
       long,
        radius,
      ])

    }else{
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
  }
  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showLocation)
    }
  }
  const handleZip = (e) => {
    setLat(null);
    setLong(null);
    setZip(e.target.value)
    
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
  const disabled = (!lat && !long ) && ( zipcode =="");
  return (
    <>
      <FormGroup style={{ marginTop: '1.5em' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <InputGroup style={{ width: "60%", marginRight: '0.5em' }}>
            <FormControl
              type="text"
              placeholder="Enter Zip Code"
              value={zipcode}
              onChange={e => handleZip(e)}
              // onBlur={() => handleZipcode()}
              style={{ flex: 4, margin: '4px' }}
            /><div className="vl"><span className="half-me">or</span></div>
            <InputGroup.Button>
              <span className='mm-tooltip'>
                <Button onClick={handleCurrentLocation}
                  className={(lat && long) ? "toggle-active input-btn" : "toggle-inactive input-btn"}>
                  <span
                    className='mm-tooltiptext mm-tooltip-tl'>
                    {(!lat && !long) ? "Select Current Location" : "Deselect Current Location"}</span>
                  <FontAwesome name={"compass"} />
                </Button>
              </span>
            </InputGroup.Button>
          </InputGroup>

          <InputGroup style={{ width: "40%" }}>
            <DistanceDropDownOptions
              removeFilters={removeFilters}
              display={(field && field.display) || FieldDisplay.STRING}
              distanceChanged={(e) => handleDistanceChanged(e)}
              //@ts-ignore
              buckets={buckets}
              isSelected={isSelected}
              field={field}
              agg={agg}
              zipcode={zipcode}
              radius={radius}
            />
          </InputGroup>
        </div>
      </FormGroup>
      {disabled ?
        <span className='mm-tooltip'>

          <FormGroup style={{ marginLeft: '0.25em' }}>
            <span
              className='mm-tooltiptext mm-tooltip-tr'>
              {"Enter Zip or select Current Location"}</span>
            <ThemedButton disabled={disabled} type="submit" className={'disabled'} onClick={() => submitLocation()} >Enter</ThemedButton>

          </FormGroup>
        </span>
        : <FormGroup style={{ marginLeft: '0.25em' }}>
          <ThemedButton disabled={disabled} type="submit" className={'disabled'} onClick={() => submitLocation()} >Enter</ThemedButton>
        </FormGroup>}
    </>
  );
}


export default LocationAgg;