import * as types from './types';

const initialState: types.FacilityState = {
    isFetchingFacilitiesPageHasura: false,                                                   
    facilitiesPageHasura: undefined,
};       

const hasuraFacilityReducer = ( state = initialState, action: types.FacilityHasuraActionTypes) : types.FacilityState => {
    switch(action.type) {
        case types.FETCH_FACILITIES_PAGE_HASURA_SEND:
            return {
                ...state,
                isFetchingFacilitiesPageHasura: true,
            };
        case types.FETCH_FACILITIES_PAGE_HASURA_SUCCESS:
            return {
                ...state,
                isFetchingFacilitiesPageHasura: false,
                facilitiesPageHasura: action.payload,
            };
        case types.FETCH_FACILITIES_PAGE_HASURA_ERROR:
            return {
                ...state,
                isFetchingFacilitiesPageHasura: false,
            };
        default:
            return { ...state };
    }
};

export default hasuraFacilityReducer;