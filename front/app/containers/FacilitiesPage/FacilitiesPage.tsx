import * as React from 'react';
import styled from 'styled-components';
import { Table } from 'react-bootstrap';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import { match } from 'react-router-dom';
import { History } from 'history';
import {
  FacilitiesPageQuery,
  FacilitiesPageQueryVariables,
} from 'types/FacilitiesPageQuery';
import { FacilityFragment } from 'types/FacilityFragment';
import StudySummary from 'components/StudySummary';

import GoogleMapReact from 'google-map-react';
import { pipe, addIndex, map, flatten, isEmpty } from 'ramda';
import { SiteStudyBasicGenericSectionFragment } from 'types/SiteStudyBasicGenericSectionFragment';
import MapMarker from './MapMarker';
import FacilityCard from './FacilityCard';

interface FacilitiesPageProps {
  history: History;
  match: match<{ nctId: string }>;
  onLoaded?: () => void;
  isWorkflow?: boolean;
  nextLink?: string | null;
  metaData: SiteStudyBasicGenericSectionFragment;
}

interface FacilitiesPageState {
  facilities: any,
  cardClicked: boolean,
  facilityExpanded: boolean,
}

const FRAGMENT = gql`
  fragment FacilityFragment on Facility {
    city
    country
    id
    name
    nctId
    state
    status
    latitude
    longitude
    zip
    contacts {
      contactType
      email
      id
      name
      nctId
      phone
    }
  }
`;

const QUERY = gql`
  query FacilitiesPageQuery($nctId: String!) {
    study(nctId: $nctId) {
      ...StudySummaryFragment
      facilities {
        ...FacilityFragment
      }
      nctId
    }
    me {
      id
    }
  }

  ${StudySummary.fragment}
  ${FRAGMENT}
`;

class QueryComponent extends Query<
  FacilitiesPageQuery,
  FacilitiesPageQueryVariables
> {}

class FacilitiesPage extends React.PureComponent<FacilitiesPageProps, FacilitiesPageState, any> {

  state = {
    facilities: [],
    cardClicked: false,
    facilityExpanded: false,
  }
  static fragment = FRAGMENT;

  processFacility = (facility: FacilityFragment, i: number) => {
    const res: { key: string; location: string; index: number; status: string; contacts: Array<object> }[] = [];
    const { name, country, city, state, zip, contacts } = facility;
    const newStatus = isEmpty(facility.status)
      ? 'status unknown'
      : facility.status;
    const newLocation = isEmpty(facility.state)
      ? `${city}, ${country}`
      : `${city}, ${state} ${zip}, ${country}`;
    res.push({
      key: name,
      location: newLocation,
      index: i + 1,
      status: newStatus,
      contacts: contacts,
    });
    return res;
  };

  renderItem = ({ key, location, index, status, contacts }: { key: string; location: string | null; index: number; status: string; contacts: Array<object>; }) => {
    return (
      <div>
        <FacilityCard 
          key={key}
          title={key}
          index={index}
          status={status}
          location={location}
          contacts={contacts}
        />
      </div>
    );
  };

  onCardClick = () => {
    this.setState({
      cardClicked: !this.state.cardClicked,
    })
  }

  render() {
    const center = { lat: 39.5, lng: -98.35 };
    const K_HOVER_DISTANCE = 30;
    return (
      <QueryComponent
        query={QUERY}
        variables={{ nctId: this.props.match.params.nctId }}
      >
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
          const items = pipe(
            addIndex(map)(this.processFacility),
            // @ts-ignore
            flatten,
          )(facilities) as { key: string; location: string; index: number; status: string; contacts: Array<object>; }[];
          return (
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
              <div style={{width: '40%'}}>
                {items.map(this.renderItem)}
              </div>
              <div style={{ height: '80vh', width: '55%', paddingBottom: '20px', marginLeft: '3px' }}>
                <GoogleMapReact
                  bootstrapURLKeys={{ key: "AIzaSyBfU6SDxHb6b_ZYtMWngKj8zyeRgcrhM5M"}}
                  defaultCenter={center}
                  defaultZoom={4}
                  hoverDistance={K_HOVER_DISTANCE}
                >
                  {facilities.map((item, index) => (
                    <MapMarker
                      onClick={this.onCardClick}
                      clicked={this.state.cardClicked}
                      key={index.toString()}
                      lat={item.latitude}
                      lng={item.longitude}
                      contacts={item.contacts}
                      text={index + 1}
                      name={item.name}
                      address={`${item.city}, ${item.state} ${item.zip}`}
                    />
                  ))}
                </GoogleMapReact>
              </div>
            </div>
          );
        }}
        
      </QueryComponent>
      
     
    );
  }
}

export default FacilitiesPage;
