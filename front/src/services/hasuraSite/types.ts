import { SitesPageQuery } from '../site/model/SitesPageQuery';
import { UpdateSiteInput } from 'services/site/model/InputTypes';
import { SiteFragment as SiteProviderQuery } from 'services/site/model/SiteFragment';

export const UPDATE_SITE_HASURA_SEND = 'UPDATE_SITE_HASURA_SEND';                   
export const UPDATE_SITE_HASURA_SUCCESS = 'UPDATE_SITE_HASURA_SUCCESS';             
export const UPDATE_SITE_HASURA_ERROR = 'UPDATE_SITE_HASURA_ERROR';                 

export const FETCH_SITES_PAGE_HASURA_SEND = 'FETCH_SITES_PAGE_HASURA_SEND';
export const FETCH_SITES_PAGE_HASURA_SUCCESS = 'FETCH_SITES_PAGE_HASURA_SUCCESS';
export const FETCH_SITES_PAGE_HASURA_ERROR = 'FETCH_SITES_PAGE_HASURA_ERROR';

export const FETCH_SITE_PROVIDER_HASURA_SEND = 'FETCH_SITE_PROVIDER_HASURA_SEND';
export const FETCH_SITE_PROVIDER_HASURA_SUCCESS = 'FETCH_SITE_PROVIDER_HASURA_SUCCESS';
export const FETCH_SITE_PROVIDER_HASURA_ERROR = 'FETCH_SITE_PROVIDER_HASURA_ERROR';

export const FETCH_GENERIC = 'FETCH_GENERIC';
export const FETCH_GENERIC_SUCCESS = 'FETCH_GENERIC_SUCCESS';
export const FETCH_GENERIC_ERROR = 'FETCH_GENERIC_ERROR';

export const UPDATE_GENERIC = 'UPDATE_GENERIC';
export const UPDATE_GENERIC_SUCCESS = 'UPDATE_GENERIC_SUCCESS';
export const UPDATE_GENERIC_ERROR = 'UPDATE_GENERIC_ERROR';

export interface SiteState {
    isUpdatingSiteHasura: boolean, 
    sitesData: any | SitesPageQuery | undefined,
    isFetchingSitesPageHasura: boolean,
    hasuraSitesData: any,
    isFetchingSiteProviderHasura: boolean,
    siteProviderHasura: any | SiteProviderQuery | undefined,
    genericData: any,
    isFetchingGeneric: boolean
}                                                                                   
                                                                                    
export interface SiteDataError {                                                    
    message: string                                                                 
};                                                                                  
                                                                                    
export interface UpdateSiteHasuraSendAction {                                       
    type: typeof UPDATE_SITE_HASURA_SEND,                                           
    input: UpdateSiteInput,                                                         
    url?: string                                                                    
}                                                                                   
                                                                                    
export interface UpdateSiteHasuraSuccessAction {                                    
    type: typeof UPDATE_SITE_HASURA_SUCCESS,                                        
    payload: SitesPageQuery                                                         
};                                                                                  
                                                                                    
export interface UpdateSiteHasuraErrorAction {                                      
    type: typeof UPDATE_SITE_HASURA_ERROR,                                          
    payload: SiteDataError                                                          
};

export interface FetchSitesPageHasuraSendAction {
    type: typeof FETCH_SITES_PAGE_HASURA_SEND
};

export interface FetchSitesPageHasuraSuccessAction {
    type: typeof FETCH_SITES_PAGE_HASURA_SUCCESS,
    payload: any 
};

export interface FetchSitesPageHasuraErrorAction {
    type: typeof FETCH_SITES_PAGE_HASURA_ERROR,
    payload: SiteDataError
};

export interface FetchSiteProviderHasuraSendAction {
    type: typeof FETCH_SITE_PROVIDER_HASURA_SEND,
    id?: number,
    url?: string
};

export interface FetchSiteProviderHasuraSuccessAction {
    type: typeof FETCH_SITE_PROVIDER_HASURA_SUCCESS,
    payload: any
};

export interface FetchSiteProviderHasuraErrorAction {
    type: typeof FETCH_SITE_PROVIDER_HASURA_ERROR,
    payload: SiteDataError
};

export interface UpdateGenericAction {                                       
    type: typeof UPDATE_GENERIC,                                           
    input: UpdateSiteInput,                                                         
    mutation?: string                                                                    
}      

export interface UpdateGenericSuccessAction {
    type: typeof UPDATE_GENERIC_SUCCESS,
    payload: any
};

export interface UpdateGenericErrorAction {
    type: typeof UPDATE_GENERIC_ERROR,
    payload: any
};

export interface FetchGeneric {
    type: typeof FETCH_GENERIC,
    payload: any 
};
export interface FetchGenericSuccessAction {
    type: typeof FETCH_GENERIC_SUCCESS,
    payload: any 
};

export interface FetchGenericErrorAction {
    type: typeof FETCH_GENERIC_ERROR,
    payload: any 
};


export type HasuraSiteActionTypes = 
    UpdateSiteHasuraSendAction | UpdateSiteHasuraSuccessAction | UpdateSiteHasuraErrorAction |
    FetchSitesPageHasuraSendAction | FetchSitesPageHasuraSuccessAction | FetchSitesPageHasuraErrorAction |
    FetchSiteProviderHasuraSendAction | FetchSiteProviderHasuraSuccessAction | FetchSiteProviderHasuraErrorAction |
    UpdateGenericAction | UpdateGenericSuccessAction | UpdateGenericErrorAction | FetchGeneric | FetchGenericSuccessAction | 
    FetchGenericErrorAction
    ;
