export const FETCH_FACILITIES_PAGE_HASURA_SEND = 'FETCH_FACILITIES_PAGE_HASURA_SEND';
export const FETCH_FACILITIES_PAGE_HASURA_SUCCESS = 'FETCH_FACILITIES_PAGE_HASURA_SUCCESS';
export const FETCH_FACILITIES_PAGE_HASURA_ERROR = 'FETCH_FACILITIES_PAGE_HASURA_ERROR';

export interface FacilityState {
    isFetchingFacilitiesPageHasura: boolean;
    facilitiesPageHasura: any | undefined;
}

export interface StudyDataError {
    message: string;
}

export interface FetchFacilitiesPageHasuraSendAction {
    type: typeof FETCH_FACILITIES_PAGE_HASURA_SEND;
    nctId: any;
}

export interface FetchFacilitiesPageHasuraSuccessAction {
    type: typeof FETCH_FACILITIES_PAGE_HASURA_SUCCESS;
    payload: any;
}

export interface FetchFacilitiesPageHasuraErrorAction {
    type: typeof FETCH_FACILITIES_PAGE_HASURA_ERROR;
    payload: StudyDataError;
}

export type FacilityHasuraActionTypes = 
    FetchFacilitiesPageHasuraSendAction | FetchFacilitiesPageHasuraSuccessAction | FetchFacilitiesPageHasuraErrorAction;