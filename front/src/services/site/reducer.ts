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
    isCreatingSiteView: false,
    isCopyingSiteView: false,
    isUpdatingSiteView: false,
    isDeletingSiteView: false,
    isFetchingSiteProvider: false,
    siteProvider: undefined,
    isFetchingPresentSiteProvider: false,
    presentSiteProvider: undefined,
    isFetchingSitesPageHasura: false,
    isFetchingHasuraPresentSiteProvider: false,
    hasuraPresentSiteProvider: undefined,
};

const siteReducer = (
    state = initialState,
    action: types.SiteActionTypes
): types.SiteState => {
    switch (action.type) {


        case types.FETCH_HASURA_PRESENT_SITE_PROVIDER_SEND:
            return {
                ...state,
                isFetchingHasuraPresentSiteProvider: true,
            };
        case types.FETCH_HASURA_PRESENT_SITE_PROVIDER_SUCCESS:
            return {
                ...state,
                isFetchingHasuraPresentSiteProvider: false,
                hasuraPresentSiteProvider: action.payload,
            };
        case types.FETCH_HASURA_PRESENT_SITE_PROVIDER_ERROR:
            return {
                ...state,
                isFetchingHasuraPresentSiteProvider: false,
            };

        default:
            return { ...state };
    }
};

export default siteReducer;
