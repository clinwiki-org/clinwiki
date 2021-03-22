import { UpdateSiteInput } from '../site/model/InputTypes';
import * as types from './types';
import { SitesPageQuery } from '../site/model/SitesPageQuery';

export const updateSiteHasura = (input: UpdateSiteInput, url?: string) : types.HasuraSiteActionTypes => ({
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

export const fetchSitesPageHasura = () : types.HasuraSiteActionTypes => (console.log("fetchSitesPageHasura hit in hasuraSite/actions"),
    {
    type: types.FETCH_SITES_PAGE_HASURA_SEND
});

export const fetchSitesPageHasuraSuccess = (payload: SitesPageQuery) : types.HasuraSiteActionTypes => ({
    type: types.FETCH_SITES_PAGE_HASURA_SUCCESS,
    payload
});

export const fetchSitesPageHasuraError = (message: string) : types.HasuraSiteActionTypes => ({
    type: types.FETCH_SITES_PAGE_HASURA_ERROR,
    payload: { message }
});

