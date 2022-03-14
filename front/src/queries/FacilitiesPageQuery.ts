import gql from 'graphql-tag';

export const FRAGMENT = gql`
  fragment FacilityFragment on Facility {
    city
    country
    id
    name
    nctId
    state
    status
    location {
      latitude
      longitude
      status
    }
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
export default gql`
query FacilitiesPageQuery($nctId: String!) {
  study(nctId: $nctId) {
    facilities {
      ...FacilityFragment
    }
    nctId
  }
  me {
    id
  }
}

${FRAGMENT}
`;
