import * as React from 'react';
import styled from 'styled-components';
import { Query, QueryComponentOptions } from 'react-apollo';
import { gql } from 'apollo-boost';
import { match } from 'react-router-dom';
import { History } from 'history';
import {
  FacilitiesPageQuery,
  FacilitiesPageQueryVariables,
  FacilitiesPageQuery_study_facilities_contacts,
} from 'types/FacilitiesPageQuery';
import { FacilityFragment } from 'types/FacilityFragment';
import StudySummary from 'components/StudySummary';
import GoogleMapReact from 'google-map-react';
import { pipe, addIndex, map, flatten, isEmpty } from 'ramda';
import { SiteStudyBasicGenericSectionFragment } from 'types/SiteStudyBasicGenericSectionFragment';
import MapMarker from './MapMarker';
import FacilityCard from './FacilityCard';
import QUERY, {FRAGMENT} from 'queries/FacilitiesPageQuery';

const MappingContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 700px;
  @media (max-width: 991px) {
    flex-direction: column-reverse;
    max-height: 1400px;
  }
`;

const ScrollCardContainer = styled.div`
  width: 45%;
  overflow-y: scroll;
  padding-right: 15px;
  margin-bottom: 15px;
  @media (max-width: 991px) {
    min-height: 250px;
    width: 100%;
    margin: 10px;
    max-height: 700px;
  }
`;

const MapContainer = styled.div`
  height: 700px;
  width: 55%;
  padding-bottom: 20px;
  margin-left: 3px;
  @media (max-width: 991px) {
    width: 100%;
  }
`;

interface FacilitiesPageProps {
  nctId: string;
  history: History;
  match: match<{ nctId: string }>;
  onLoaded?: () => void;
  isWorkflow?: boolean;
  nextLink?: string | null;
  metaData: SiteStudyBasicGenericSectionFragment;
}

interface FacilitiesPageState {
  facilities: any;
  markerClicked: boolean;
  facilityExpanded: boolean;
  mapCenter: object;
  mapZoom: number;
}

const MAPOPTIONS = {
  minZoom: 0,
};

const QueryComponent = (
  props: QueryComponentOptions<
    FacilitiesPageQuery,
    FacilitiesPageQueryVariables
  >
) => Query(props);

class FacilitiesPage extends React.PureComponent<
  FacilitiesPageProps,
  FacilitiesPageState,
  any
> {
  state = {
    facilities: [],
    markerClicked: false,
    facilityExpanded: false,
    mapCenter: { lat: 39.5, lng: -98.35 },
    mapZoom: 4,
  };
  static fragment = FRAGMENT;

  componentDidMount = () => {
    this.setState({
      mapZoom: 4,
      mapCenter: {
        lat: 39.5,
        lng: -98.35,
      },
    });
  };

  componentDidUpdate = prevProps => {
    if (prevProps.match.params.nctId !== this.props.match.params.nctId) {
      this.setState({
        mapZoom: 4,
        mapCenter: {
          lat: 39.5,
          lng: -98.35,
        },
      });
    }
  };

  processFacility = (facility: FacilityFragment, i: number) => {
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

  renderFacilityCards = ({
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
          numberClick={this.onCardNumberClick}
        />
      </div>
    );
  };

  onMarkerClick = () => {
    this.setState({
      markerClicked: !this.state.markerClicked,
    });
  };

  onCardNumberClick = (lat, long, status) => {
    if (status === 'bad') {
      return null;
    } else
      this.setState({
        mapCenter: {
          lat: lat,
          lng: long,
        },
        mapZoom: 8,
      });
  };

  render() {
    const { mapCenter, mapZoom } = this.state;
    const K_HOVER_DISTANCE = 30;
    return (
      <QueryComponent query={QUERY} variables={{ nctId: this.props.nctId }}>
        {({ data, loading, error }) => {
          if (
            loading ||
            error ||
            !data ||
            !data.study ||
            !data.study.facilities
          ) {
            return null;
          }
          this.props.onLoaded && this.props.onLoaded();
          const facilities = data.study.facilities;
          // @ts-ignore
          const items = pipe(
            // @ts-ignore
            addIndex(map)(this.processFacility),
            // @ts-ignore
            flatten
            // @ts-ignore
          )(facilities) as {
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
            <MappingContainer>
              <ScrollCardContainer>
                {items.map(this.renderFacilityCards)}
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
                  key={this.props}>
                  {facilities.map((item, index) => {
                    if ((item.location?.status ?? 'bad') === 'bad') {
                      return null;
                    } else
                      return (
                        <MapMarker
                          onClick={this.onMarkerClick}
                          clicked={this.state.markerClicked}
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
          );
        }}
      </QueryComponent>
    );
  }
}

export default FacilitiesPage;
