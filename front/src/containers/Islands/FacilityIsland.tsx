import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { Panel } from 'react-bootstrap';
import QUERY from 'queries/FacilitiesPageQuery';
import { useQuery, useMutation } from 'react-apollo';

import {
  FacilitiesPageQuery,
  FacilitiesPageQueryVariables,
  FacilitiesPageQuery_study_facilities_contacts,
} from 'types/FacilitiesPageQuery';
import { FacilityFragment } from 'types/FacilityFragment';
import GoogleMapReact from 'google-map-react';
import { pipe, addIndex, map, flatten, isEmpty } from 'ramda';
import MapMarker from '../../containers/FacilitiesPage/MapMarker';
import FacilityCard from '.../../containers/FacilitiesPage//FacilityCard';

interface Props {
  nctId?: string;
}
const MappingContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 60vh;
  @media (max-width: 991px) {
    flex-direction: column-reverse;
    max-height: 1400px;
  }
`;
const StyledPanel = styled(Panel)`
  padding: 16px;
`;
const ScrollCardContainer = styled.div`
  width: 45%;
  overflow-y: scroll;
  padding-right: 15px;
  margin-bottom: 15px;
  @media (max-width: 991px) {
    width: 100%;
    margin: 10px;
    max-height: 30vh;
  }
`;

const MapContainer = styled.div`
  height: 60vh;
  width: 55%;
  padding-bottom: 20px;
  margin-left: 3px;
  @media (max-width: 991px) {
    width: 100%;
    max-height: 30vh;
  }
`;
const MAPOPTIONS = {
  minZoom: 0,
};

const processFacility = (facility: FacilityFragment, i: number) => {
  const res: {
    key: string | null;
    location: string;
    index: number;
    status: string;
    contacts: Array<object>;
    latitude: number | null;
    longitude: number | null;
    geoStatus: string | null;
    name: string | null;
  }[] = [];
  const { name, country, city, state, zip, contacts, location } = facility;
  const latitude = location?.latitude ?? null;
  const longitude = location?.longitude ?? null;
  const geoStatus = location?.status ?? null;
  const newStatus = isEmpty(facility.status)
    ? 'Status Unknown'
    : facility.status;
  const newLocation = isEmpty(facility.state)
    ? `${city}, ${country}`
    : `${city}, ${state} ${zip}, ${country}`;
  const uid = `${city}-${state}-${zip}-${country}`;

  res.push({
    name: name,
    key: uid,
    location: newLocation,
    index: i + 1,
    status: newStatus,
    contacts: contacts,
    latitude: latitude,
    longitude: longitude,
    geoStatus: geoStatus,
  });
  return res;
};

export default function FacilityIsland(props: Props) {
  const { nctId } = props;
  const [markerClicked, setMarkerClicked] = useState(false);
  const [mapZoom, setMapZoom] = useState(4);
  const [mapCenter, setMapCenter] = useState({
    lat: 39.5,
    lng: -98.35,
  });
  // const [facilities, setFacilities]= useState([])
  const onMarkerClick = () => {
    setMarkerClicked(!markerClicked);
  };

  const onCardNumberClick = (lat, long, status) => {
    if (status === 'bad') {
      return null;
    } else
      setMapCenter({
        lat: lat,
        lng: long,
      });
    setMapZoom(8);
  };

  const renderFacilityCards = ({
    key,
    location,
    index,
    status,
    contacts,
    latitude,
    longitude,
    geoStatus,
    name,
  }: {
    key: string;
    name: string | null;
    location: string | null;
    index: number;
    status: string;
    contacts: FacilitiesPageQuery_study_facilities_contacts[];
    latitude: number | null;
    longitude: number | null;
    geoStatus: string | null;
  }) => {
    return (
      <div key={`${key}-${name}`}>
        <FacilityCard
          name={name}
          title={key}
          index={index}
          status={status}
          location={location}
          contacts={contacts}
          latitude={latitude}
          longitude={longitude}
          geoStatus={geoStatus}
          numberClick={onCardNumberClick}
        />
      </div>
    );
  };

  const { data: facilityData } = useQuery<FacilitiesPageQuery>(QUERY, {
    variables: { nctId },
  });

  const K_HOVER_DISTANCE = 30;
  const facilities = facilityData?.study?.facilities;

  if (facilities && facilities?.length > 0) {
    const items = pipe(addIndex(map)(processFacility), flatten)(facilities) as {
      name: string;
      key: string;
      location: string;
      index: number;
      status: string;
      contacts: FacilitiesPageQuery_study_facilities_contacts[];
      latitude: number | null;
      longitude: number | null;
      geoStatus: string;
    }[];

    return (
      <div>
        <StyledPanel>
          <MappingContainer>
            <ScrollCardContainer>
              {items.map(renderFacilityCards)}
            </ScrollCardContainer>
            <MapContainer>
              <GoogleMapReact
                bootstrapURLKeys={{
                  key: 'AIzaSyBfU6SDxHb6b_ZYtMWngKj8zyeRgcrhM5M',
                }}
                defaultCenter={{ lat: 39.5, lng: -98.35 }}
                center={mapCenter}
                defaultZoom={4}
                zoom={mapZoom}
                hoverDistance={K_HOVER_DISTANCE}
                options={MAPOPTIONS}
                key={nctId}>
                {facilities.map((item, index) => {
                  if ((item.location?.status ?? 'bad') === 'bad') {
                    return null;
                  } else
                    return (
                      <MapMarker
                        onClick={onMarkerClick}
                        clicked={markerClicked}
                        key={`${item.name}${item.location?.latitude}`}
                        lat={item.location?.latitude}
                        lng={item.location?.longitude}
                        geoStatus={item.location?.status}
                        contacts={item.contacts}
                        text={index + 1}
                        name={item.name}
                        address={`${item.city}, ${item.state} ${item.zip}`}
                      />
                    );
                })}
              </GoogleMapReact>
            </MapContainer>
          </MappingContainer>
        </StyledPanel>
      </div>
    );
  }
  return null
}
