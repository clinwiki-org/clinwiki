import { UpdateSiteInput } from '../site/model/InputTypes';
import * as types from './types';
import { SitesPageQuery } from '../site/model/SitesPageQuery';

export const updateSiteHasura = (input: UpdateSiteInput, url?: string) : types.SiteActionTypes => ({
    type: types.UPDATE_SITE_HASURA_SEND,
    input,
    url
});

export const updateSiteHasuraSuccess = (payload: any) : types.SiteActionTypes => ({
    type: types.UPDATE_SITE_HASURA_SUCCESS,
    payload
});

export const updateSiteHasuraError = (message: string) : types.SiteActionTypes => ({
    type: types.UPDATE_SITE_HASURA_ERROR,
    payload: { message }
});

export const fetchSitesPageHasura = () : types.SiteActionTypes => ({
    type: types.FETCH_SITES_PAGE_HASURA_SEND
});

export const fetchSitesPageHasuraSuccess = (payload: SitesPageQuery) : types.SiteActionTypes => ({
    type: types.FETCH_SITES_PAGE_HASURA_SUCCESS,
    payload
});

export const fetchSitesPageHasuraError = (message: string) : types.SiteActionTypes => ({
    type: types.FETCH_SITES_PAGE_HASURA_ERROR,
    payload: { message }
});

