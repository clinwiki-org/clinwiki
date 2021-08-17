import * as types from './types';

const initialState: types.SiteState = {
    isFetchingSitesPageHasura: false,
    isUpdatingSiteHasura: false,                                                    
    sitesData: undefined,
    hasuraSitesData: undefined,
    isFetchingSiteProviderHasura: false,
    siteProviderHasura: undefined,
    isFetchingGeneric: false,
    genericData: undefined,
    genericUpdateErrorMessage: "",
    genericUpdateSuccessMessage: ""
};                                                                                  
                                                                                    
const hasuraSiteReducer = ( state = initialState, action: types.HasuraSiteActionTypes) : types.SiteState => {
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
            //console.log("FETCH_SITES_PAGE_HASURA_SEND hit in hasuraSite reducer"); 
	        return {
                ...state,
                isFetchingSitesPageHasura: true
            };
        case types.FETCH_SITES_PAGE_HASURA_SUCCESS:
            //console.log("FETCH_SITES_PAGE_HASURA_SUCCESS hit in hasuraSite reducer"); 
            return {
                ...state,
                isFetchingSitesPageHasura: false,
                hasuraSitesData: action.payload
            };
        case types.FETCH_SITES_PAGE_HASURA_ERROR:
            return {
                ...state,
                isFetchingSitesPageHasura: false
            };
        case types.FETCH_SITE_PROVIDER_HASURA_SEND:
            //console.log("FETCH_SITE_PROVIDER_HASURA_SEND called in hasuraSite/reducer");
            return {
                ...state,
                isFetchingSiteProviderHasura: true
            };
        case types.FETCH_SITE_PROVIDER_HASURA_SUCCESS:
            //console.log("FETCH_SITE_PROVIDER_HASURA_SUCCESS called in hasuraSite/reducer");
            return {
                ...state,
                isFetchingSiteProviderHasura: false,
                siteProviderHasura: action.payload
            };
        case types.FETCH_SITE_PROVIDER_HASURA_ERROR:
            //console.log("FETCH_SITE_PROVIDER_HASURA_ERROR called in hasuraSite/reducer");
            return {
                ...state,
                isFetchingSiteProviderHasura: false
            };
        case types.FETCH_GENERIC:
            //console.log("FETCH_SITES_PAGE_HASURA_SEND hit in hasuraSite reducer"); 
            return {
                ...state,
                isFetchingGeneric: true
            };
        case types.FETCH_GENERIC_SUCCESS:
            //console.log("FETCH_GENERIC_SUCCESS hit in hasuraSite reducer"); 
            return {
                ...state,
                isFetchingGeneric: false,
                genericData: action.payload
            };
        case types.FETCH_GENERIC_ERROR:
            return {
                ...state,
                isFetchingGeneric: false
            }; 
        case types.UPDATE_GENERIC_ERROR:
            return {
                ...state,
                genericUpdateErrorMessage: action.payload
            }; 
        case types.UPDATE_GENERIC_SUCCESS:
            return {
                ...state,
                genericUpdateSuccessMessage: action.message
            }; 
        default:                                                                    
            return {...state};                                                      
    }      
   
}   

export default hasuraSiteReducer;        
