import { SitesPageQuery } from 'services/site/model/SitesPageQuery';
import * as types from './types';

const initialState: types.SiteState = {
    isFetchingAdminSiteView: false,
    adminSiteView: undefined,
    isFetchingSitesPage: false,
    sitesPage: undefined,
    isDeletingSite: false,
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


        case types.DELETE_SITE_SEND:
            return {
                ...state,
                isDeletingSite: true
            };
        case types.DELETE_SITE_SUCCESS:            
            return {
                ...state,
                isDeletingSite: false,
                sitesPage: { me: action.payload }
            };
        case types.DELETE_SITE_ERROR:
            return {
                ...state,
                isDeletingSite: false
            };


        default:
            return {...state};
    }
}

export default siteReducer;