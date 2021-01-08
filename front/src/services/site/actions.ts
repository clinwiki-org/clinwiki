import { last } from 'ramda';
import * as types from './types';

import { SitesPageQuery } from 'services/site/model/SitesPageQuery';
import { AdminViewsProviderQuery } from 'services/site/model/AdminViewsProviderQuery';
import { CreateSiteInput, UpdateSiteInput } from 'services/site/model/InputTypes';
import { SiteFragment as SiteProviderQuery } from 'services/site/model/SiteFragment';


export const fetchAdminUserSite = () : types.SiteActionTypes => ({
    type: types.FETCH_ADMIN_SITE_VIEW_SEND
});

export const fetchAdminSiteViewSuccess = (payload: AdminViewsProviderQuery) : types.SiteActionTypes => ({
    type: types.FETCH_ADMIN_SITE_VIEW_SUCCESS,
    payload
});

export const fetchAdminSiteViewError = (message: string) : types.SiteActionTypes => ({
    type: types.FETCH_ADMIN_SITE_VIEW_ERROR,
    payload: { message }
});


export const fetchSitesPage = () : types.SiteActionTypes => ({
    type: types.FETCH_SITES_PAGE_SEND
});

export const fetchSitesPageSuccess = (payload: SitesPageQuery) : types.SiteActionTypes => ({
    type: types.FETCH_SITES_PAGE_SUCCESS,
    payload
});

export const fetchSitesPageError = (message: string) : types.SiteActionTypes => ({
    type: types.FETCH_SITES_PAGE_ERROR,
    payload: { message }
});


export const fetchSiteProvider = (id?: number, url?: string) : types.SiteActionTypes => ({
    type: types.FETCH_SITE_PROVIDER_SEND,
    id,
    url
});

export const fetchSiteProviderSuccess = (payload: SiteProviderQuery) : types.SiteActionTypes => ({
    type: types.FETCH_SITE_PROVIDER_SUCCESS,
    payload
});

export const fetchSiteProviderError = (message: string) : types.SiteActionTypes => ({
    type: types.FETCH_SITE_PROVIDER_ERROR,
    payload: { message }
});


export const deleteSite = (id: number) : types.SiteActionTypes => ({
    type: types.DELETE_SITE_SEND,
    id
});

export const deleteSiteSuccess = (payload: any) : types.SiteActionTypes => ({
    type: types.DELETE_SITE_SUCCESS,
    payload
});

export const deleteSiteError = (message: string) : types.SiteActionTypes => ({
    type: types.DELETE_SITE_ERROR,
    payload: { message }
});


export const createSite = (input: CreateSiteInput, url?: string) : types.SiteActionTypes => ({
    type: types.CREATE_SITE_SEND,
    input,
    url
});

export const createSiteSuccess = (payload: any) : types.SiteActionTypes => ({
    type: types.CREATE_SITE_SUCCESS,
    payload
});

export const createSiteError = (message: string) : types.SiteActionTypes => ({
    type: types.CREATE_SITE_ERROR,
    payload: { message }
});


export const updateSite = (input: UpdateSiteInput, url?: string) : types.SiteActionTypes => ({
    type: types.UPDATE_SITE_SEND,
    input,
    url
});

export const updateSiteSuccess = (payload: any) : types.SiteActionTypes => ({
    type: types.UPDATE_SITE_SUCCESS,
    payload
});

export const updateSiteError = (message: string) : types.SiteActionTypes => ({
    type: types.UPDATE_SITE_ERROR,
    payload: { message }
});

export const updateSiteView = (input: UpdateSiteInput, url?: string) : types.SiteActionTypes => ({
    type: types.UPDATE_SITE_VIEW_SEND,
    input,
    url
});

export const updateSiteViewSuccess = (payload: any) : types.SiteActionTypes => ({
    type: types.UPDATE_SITE_VIEW_SUCCESS,
    payload
});

export const updateSiteViewError = (message: string) : types.SiteActionTypes => ({
    type: types.UPDATE_SITE_VIEW_ERROR,
    payload: { message }
});
