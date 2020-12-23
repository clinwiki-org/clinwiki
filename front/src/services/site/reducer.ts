import * as types from './types';

const initialState: types.SiteState = {
    isFetchingAdminSiteView: false,
    adminSiteView: undefined,
    isFetchingSitesPage: false,
    sitesPage: undefined

};

const siteReducer = ( state = initialState, action: types.SiteActionTypes) : types.SiteState => {
    switch(action.type) {
        case types.FETCH_ADMIN_SITE_VIEW_SEND:
            return {
                ...state,
                isFetchingAdminSiteView: true
            };
        case types.FETCH_ADMIN_SITE_VIEW_SUCCESS:
            return {
                ...state,
                isFetchingAdminSiteView: false
            };
        case types.FETCH_ADMIN_SITE_VIEW_ERROR:
            return {
                ...state,
                isFetchingAdminSiteView: false
            };


            case types.FETCH_SITES_PAGE_SEND:
            return {
                ...state,
                isFetchingSitesPage: true
            };
        case types.FETCH_SITES_PAGE_SUCCESS:
            return {
                ...state,
                isFetchingSitesPage: false,
                sitesPage: action.payload
            };
        case types.FETCH_SITES_PAGE_ERROR:
            return {
                ...state,
                isFetchingSitesPage: false
            };


        default:
            return {...state};
    }
}

export default siteReducer;