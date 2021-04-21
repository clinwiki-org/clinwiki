export const FACILITY_FRAGMENT = `
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
export const FACILITIES_PAGE_QUERY = `
query FacilitiesPageQuery($nctId: String!) {
  study(nctId: $nctId) {
    facilities {
      ...FacilityFragment   } 
    nctId 
  } 
  me { 
    id 
  } 
}
${FACILITY_FRAGMENT}
`;