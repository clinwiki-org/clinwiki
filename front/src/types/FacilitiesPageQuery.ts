/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: FacilitiesPageQuery
// ====================================================

export interface FacilitiesPageQuery_study_facilities_location {
  __typename: "Location";
  latitude: number | null;
  longitude: number | null;
  status: string;
}

export interface FacilitiesPageQuery_study_facilities_contacts {
  __typename: "FacilityContact";
  contactType: string;
  email: string | null;
  id: number;
  name: string | null;
  nctId: string;
  phone: string | null;
}

export interface FacilitiesPageQuery_study_facilities {
  __typename: "Facility";
  city: string;
  country: string;
  id: number;
  name: string | null;
  nctId: string;
  state: string;
  status: string;
  location: FacilitiesPageQuery_study_facilities_location | null;
  zip: string;
  contacts: FacilitiesPageQuery_study_facilities_contacts[];
}

export interface FacilitiesPageQuery_study {
  __typename: "Study";
  facilities: FacilitiesPageQuery_study_facilities[];
  nctId: string;
}

export interface FacilitiesPageQuery_me {
  __typename: "User";
  /**
   * Id
   */
  id: number;
}

export interface FacilitiesPageQuery {
  study: FacilitiesPageQuery_study | null;
  /**
   * Current logged in user
   */
  me: FacilitiesPageQuery_me | null;
}

export interface FacilitiesPageQueryVariables {
  nctId: string;
}
