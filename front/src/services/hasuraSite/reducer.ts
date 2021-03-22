import { SitesPageQuery } from '../site/model/SitesPageQuery';
import * as types from './types';

const initialState: types.SiteState = {
    isFetchingSitesPageHasura: false,
    isUpdatingSiteHasura: false,                                                    
    sitesData: undefined,
};                                                                                  
                                                                                    
const siteReducer = ( state = initialState, action: types.SiteActionTypes) : types.SiteState => {
    switch(action.type) {                                                           
        case types.UPDATE_SITE_HASURA_SEND:                                         
            return {
                ...state,                                                           
                isUpdatingSiteHasura: true                                          
            };  
        case types.UPDATE_SITE_HASURA_SUCCESS:                                      
            return {
                ...state,                                                           
                isUpdatingSiteHasura: false,                                        
                sitesData: action.payload
            };  
        case types.UPDATE_SITE_HASURA_ERROR:                                        
            return {
                ...state,                                                           
                isUpdatingSiteHasura: false                                         
            };
        case types.FETCH_SITES_PAGE_HASURA_SEND:
            return {
                ...state,
                isFetchingSitesPageHasura: true
            };
        case types.FETCH_SITES_PAGE_HASURA_SUCCESS:
            return {
                ...state,
                isFetchingSitesPageHasura: false,
                sitesData: action.payload
            };
        case types.FETCH_SITES_PAGE_HASURA_ERROR:
            return {
                ...state,
                isFetchingSitesPageHasura: false
            };

        default:                                                                    
            return {...state};                                                      
    }       
}   

export default siteReducer;        
