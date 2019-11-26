/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FacilityFragment
// ====================================================

export interface FacilityFragment_contacts {
  __typename: "FacilityContact";
  contactType: string;
  email: string | null;
  id: number;
  name: string | null;
  nctId: string;
  phone: string | null;
}

export interface FacilityFragment {
  __typename: "Facility";
  city: string;
  country: string;
  id: number;
  name: string;
  nctId: string;
  state: string;
  status: string;
  latitude: number;
  longitude: number;
  zip: string;
  latitude: number;
  longitude: number;
  contacts: FacilityFragment_contacts[];
}
