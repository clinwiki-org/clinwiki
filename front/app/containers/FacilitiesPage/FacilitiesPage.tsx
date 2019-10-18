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
  activeMarker: object,
  cardVisible: boolean,
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

// const AnyReactComponent = ({ text, lat, lng }) => <div>{text}</div>;


class QueryComponent extends Query<
  FacilitiesPageQuery,
  FacilitiesPageQueryVariables
> {}

class FacilitiesPage extends React.PureComponent<FacilitiesPageProps, FacilitiesPageState, any> {
  static fragment = FRAGMENT;

  // state ={
  //   activeMarker: {},
  //   cardVisible: false,
  // }

  processFacility = (facility: FacilityFragment, i: number) => {
    console.log(facility);
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

  // distanceToMouse = ({markerPos, mousePos, markerProps} : {markerPos: }) => {
  //   const x = markerPos.x;
  //   // because of marker non symmetric,
  //   // we transform it central point to measure distance from marker circle center
  //   // you can change distance function to any other distance measure
  //   const y = markerPos.y - K_STICK_SIZE - K_CIRCLE_SIZE / 2;

  //   // and i want that hover probability on markers with text === 'A' be greater than others
  //   // so i tweak distance function (for example it's more likely to me that user click on 'A' marker)
  //   // another way is to decrease distance for 'A' marker
  //   // this is really visible on small zoom values or if there are a lot of markers on the map
  //   const distanceKoef = markerProps.text !== 'A' ? 1.5 : 1;

  //   // it's just a simple example, you can tweak distance function as you wish
  //   return distanceKoef * Math.sqrt((x - mousePos.x) * (x - mousePos.x) + (y - mousePos.y) * (y - mousePos.y));
  // }


  render() {
    const center = { lat: 39.5, lng: -98.35 };
    const facilityArr = [
      {
        city: 'Bethesda',
        state: 'Maryland',
        name: "National Institute of Neurological Disorders and Stroke (NINDS)",
        country: 'United States',
      },
      {
        city: 'Durham',
        state: 'North Carolina',
        name: "Duke University",
        country: 'United States',
      },
    ];
    const K_HOVER_DISTANCE = 30;
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
          const items = pipe(
            addIndex(map)(this.processFacility),
            // @ts-ignore
            flatten,
          )(facilities) as { key: string; value: string }[];
          return (
            <Table striped bordered condensed>
              <tbody>{items.map(this.renderItem)}</tbody>
            </Table>
          );
        }}
      </QueryComponent>
      <div style={{ height: '100vh', width: '100%', paddingBottom: '20px', }}>
          <GoogleMapReact
            bootstrapURLKeys={{ key: "AIzaSyBO8EcEkM2ssqj9Xi260UQkk5bkPfAJGlw" }}
            defaultCenter={center}
            defaultZoom={4}
            hoverDistance={K_HOVER_DISTANCE}
          >
            <MapMarker
              lat={39}
              lng={-98}
              text="1" 
            />
            <MapMarker
              lat={37}
              lng={-96}
              text="2" 
            />
          </GoogleMapReact>
        </div>
     </div>
    );
  }
}

export default FacilitiesPage;
