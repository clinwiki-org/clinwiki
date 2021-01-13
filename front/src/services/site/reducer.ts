import { SitesPageQuery } from 'services/site/model/SitesPageQuery';
import * as types from './types';

const initialState: types.SiteState = {
    isFetchingAdminSiteView: false,
    adminSiteView: undefined,
    isFetchingSitesPage: false,
    sitesData: undefined,
    isDeletingSite: false,
    isCreatingSite: false,
    isUpdatingSite: false,
    isFetchingSiteProvider: false,
    isCopyingSiteView: false,
    siteProvider: undefined,
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
                sitesData: action.payload
            };
        case types.FETCH_SITES_PAGE_ERROR:
            return {
                ...state,
                isFetchingSitesPage: false
            };

        case types.FETCH_SITE_PROVIDER_SEND:
            return {
                ...state,
                isFetchingSiteProvider: true
            };
        case types.FETCH_SITE_PROVIDER_SUCCESS:
            return {
                ...state,
                isFetchingSiteProvider: false,
                siteProvider: action.payload
            };
        case types.FETCH_SITE_PROVIDER_ERROR:
            return {
                ...state,
                isFetchingSiteProvider: false
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
                sitesData: { me: action.payload }
            };
        case types.DELETE_SITE_ERROR:
            return {
                ...state,
                isDeletingSite: false
            };
        case types.CREATE_SITE_SEND:
            return {
                ...state,
                isCreatingSite: true
            };
        case types.CREATE_SITE_SUCCESS:            
            return {
                ...state,
                isCreatingSite: false,
                sitesData: action.payload
            };
        case types.CREATE_SITE_ERROR:
            return {
                ...state,
                isCreatingSite: false
            };
        case types.UPDATE_SITE_SEND:
            return {
                ...state,
                isUpdatingSite: true
            };
        case types.UPDATE_SITE_SUCCESS:            
            return {
                ...state,
                isUpdatingSite: false,
                sitesData: action.payload
            };
        case types.UPDATE_SITE_ERROR:
            return {
                ...state,
                isUpdatingSite: false
            };
        case types.COPY_SITE_VIEW_SEND:
            return {
                ...state,
                isCopyingSiteView: true
            };
        case types.COPY_SITE_VIEW_SUCCESS:            
            return {
                ...state,
                isCopyingSiteView: false,
                sitesData: action.payload
            };
        case types.COPY_SITE_VIEW_ERROR:
            return {
                ...state,
                isCopyingSiteView: false
            };


        default:
            return {...state};
    }
}

export default siteReducer;
