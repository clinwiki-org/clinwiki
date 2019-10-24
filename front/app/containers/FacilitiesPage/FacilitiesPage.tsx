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
  }
  static fragment = FRAGMENT;

  processFacility = (facility: FacilityFragment, i: number) => {
    const res: { key: string; value: string }[] = [];
    const { name, country, city, state, zip, latitude, longitude } = facility;
    const status = isEmpty(facility.status)
      ? 'status unknown'
      : facility.status;
    res.push({
      key: `Facility ${i + 1}`,
      value: `${country}: ${name}, ${city} ${state} ${zip} (${status}) ${latitude} ${longitude}`,
    });

    for (const contact of facility.contacts) {
      let value = ` ${contact.name}`;
      if (contact.email) value += ` email: ${contact.email}`;
      if (contact.phone) value += ` phone: ${contact.phone}`;
      res.push({ value, key: `Facility ${i + 1} ${contact.contactType}` });
    }

    return res;
  };

  renderItem = ({ key, value }: { key: string; value: string | null }) => {
    return (
      <tr key={key}>
        <td style={{ width: '20%', verticalAlign: 'middle' }}>
          <b>{key}</b>
        </td>
        <td>{value || ''}</td>
      </tr>
    );
  };

  render() {
    const center = { lat: 39.5, lng: -98.35 };
    const K_HOVER_DISTANCE = 30;
    // console.log(this.processFacility())
    return (
      <div>
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
          console.log(facilities)
          const items = pipe(
            addIndex(map)(this.processFacility),
            // @ts-ignore
            flatten,
          )(facilities) as { key: string; value: string }[];
          return (
            <div>
              <Table striped bordered condensed>
                <tbody>{items.map(this.renderItem)}</tbody>
              </Table>
              <div style={{ height: '50vh', width: '100%', paddingBottom: '20px', }}>
                <GoogleMapReact
                  bootstrapURLKeys={{ key: "AIzaSyBfU6SDxHb6b_ZYtMWngKj8zyeRgcrhM5M"}}
                  defaultCenter={center}
                  defaultZoom={4}
                  hoverDistance={K_HOVER_DISTANCE}
                >
                  {facilities.map((item, index) => (
                    <MapMarker
                      key={index.toString()}
                      lat={item.latitude}
                      lng={item.longitude}
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
      
     </div>
    );
  }
}

export default FacilitiesPage;
