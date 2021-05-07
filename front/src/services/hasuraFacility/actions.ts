import * as types from './types';

export const fetchFacilitiesHasuraPage = (nctId: string): types.FacilityHasuraActionTypes => ({
    type: types.FETCH_FACILITIES_PAGE_HASURA_SEND,
    nctId,
});
export const fetchFacilitiesPageHasuraSuccess = (
    payload: any
): types.FacilityHasuraActionTypes => ({
    type: types.FETCH_FACILITIES_PAGE_HASURA_SUCCESS,
    payload,
});
export const fetchFacilitiesPageHasuraError = (
    message: string
): types.FacilityHasuraActionTypes => ({
    type: types.FETCH_FACILITIES_PAGE_HASURA_ERROR,
    payload: { message },
});