import { UpdateSiteInput } from '../site/model/InputTypes';
import * as types from './types';
import { SitesPageQuery } from '../site/model/SitesPageQuery';

export const updateSiteHasura = (input: any, url?: string) : types.HasuraSiteActionTypes => ({
    type: types.UPDATE_SITE_HASURA_SEND,
    input,
    url
});

export const updateSiteHasuraSuccess = (payload: any) : types.HasuraSiteActionTypes => ({
    type: types.UPDATE_SITE_HASURA_SUCCESS,
    payload
});

export const updateSiteHasuraError = (message: string) : types.HasuraSiteActionTypes => ({
    type: types.UPDATE_SITE_HASURA_ERROR,
    payload: { message }
});

export const fetchSitesPageHasura = () : types.HasuraSiteActionTypes => ({
    type: types.FETCH_SITES_PAGE_HASURA_SEND
});

export const fetchSitesPageHasuraSuccess = (payload: any) : types.HasuraSiteActionTypes => ({
    type: types.FETCH_SITES_PAGE_HASURA_SUCCESS,
    payload
});

export const fetchSitesPageHasuraError = (message: string) : types.HasuraSiteActionTypes => ({
    type: types.FETCH_SITES_PAGE_HASURA_ERROR,
    payload: { message }
});

export const fetchSiteProviderHasura = (id?: number, url?: string) : types.HasuraSiteActionTypes => ({
    type: types.FETCH_SITE_PROVIDER_HASURA_SEND,
    id,
    url
});

export const fetchSiteProviderHasuraSuccess = (payload: any) : types.HasuraSiteActionTypes => ({
    type: types.FETCH_SITE_PROVIDER_HASURA_SUCCESS,
    payload
});

export const fetchSiteProviderHasuraError = (message: string) : types.HasuraSiteActionTypes => ({
    type: types.FETCH_SITE_PROVIDER_HASURA_ERROR,
    payload: { message }
});

export const updateGeneric = (input: any, mutation?: string) : types.HasuraSiteActionTypes => ({
    type: types.UPDATE_GENERIC,
    input,
    mutation
});

export const updateGenericSuccess = (payload: any, message: string) : types.HasuraSiteActionTypes => ({
    type: types.UPDATE_GENERIC_SUCCESS,
    payload,
    message
});

export const updateGenericError = (payload: any) : types.HasuraSiteActionTypes => ({
    type: types.UPDATE_GENERIC_ERROR,
    payload
});

export const fetchGeneric = (payload: any) : types.HasuraSiteActionTypes => ({
    type: types.FETCH_GENERIC,
    payload
});

export const fetchGenericSuccess = (payload: any) : types.HasuraSiteActionTypes => ({
    type: types.FETCH_GENERIC_SUCCESS,
    payload
});

export const fetchGenericError = (message: string) : types.HasuraSiteActionTypes => ({
    type: types.FETCH_GENERIC_ERROR,
    payload: { message }
});

// export const updateGenericSuccess = (payload: any) : types.HasuraSiteActionTypes => ({
//     type: types.UPDATE_GENERIC_SUCCESS,
//     payload
// });