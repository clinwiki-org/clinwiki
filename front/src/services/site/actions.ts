import { last } from 'ramda';
import * as types from './types';

import { SitesPageQuery } from 'services/site/model/SitesPageQuery';
import { AdminViewsProviderQuery } from 'services/site/model/AdminViewsProviderQuery';
import { CreateSiteInput, UpdateSiteInput, CreateSiteViewInput, CopySiteViewInput, UpdateSiteViewInput,  DeleteSiteViewInput } from 'services/site/model/InputTypes';
import { SiteFragment as SiteProviderQuery } from 'services/site/model/SiteFragment';
import { PresentSiteFragment as PresentSiteProviderQuery } from 'services/site/model/PresentSiteFragment';


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

export const fetchPresentSiteProvider = (id?: number, url?: string) : types.SiteActionTypes => (
    //console.log("ACTION Present Site Provider", url),
{
    type: types.FETCH_PRESENT_SITE_PROVIDER_SEND,
    id,
    url
});

export const fetchPresentSiteProviderSuccess = (payload: PresentSiteProviderQuery) : types.SiteActionTypes => ({
    type: types.FETCH_PRESENT_SITE_PROVIDER_SUCCESS,
    payload
});

export const fetchPresentSiteProviderError = (message: string) : types.SiteActionTypes => ({
    type: types.FETCH_PRESENT_SITE_PROVIDER_ERROR,
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

export const copySiteView = (id: number, input: CopySiteViewInput) : types.SiteActionTypes => ({
    type: types.COPY_SITE_VIEW_SEND,
    id,
    input
});

export const copySiteViewSuccess = (payload: any) : types.SiteActionTypes => ({
    type: types.COPY_SITE_VIEW_SUCCESS,
    payload
});

export const copySiteViewError = (message: string) : types.SiteActionTypes => ({
    type: types.COPY_SITE_VIEW_ERROR,
    payload: { message }
});

export const createSiteView = (id: number, input: CreateSiteViewInput) : types.SiteActionTypes => ({
    type: types.CREATE_SITE_VIEW_SEND,
    id,
    input
});

export const createSiteViewSuccess = (payload: any) : types.SiteActionTypes => ({
    type: types.CREATE_SITE_VIEW_SUCCESS,
    payload
});

export const createSiteViewError = (message: string) : types.SiteActionTypes => ({
    type: types.CREATE_SITE_VIEW_ERROR,
    payload: { message }
});

export const deleteSiteView = (input: DeleteSiteViewInput) : types.SiteActionTypes => ({
    type: types.DELETE_SITE_VIEW_SEND,
    input
});

export const deleteSiteViewSuccess = (payload: any) : types.SiteActionTypes => ({
    type: types.DELETE_SITE_VIEW_SUCCESS,
    payload
});

export const deleteSiteViewError = (message: string) : types.SiteActionTypes => ({
    type: types.DELETE_SITE_VIEW_ERROR,
    payload: { message }
});

export const updateSiteView = (id: number, input: UpdateSiteViewInput) : types.SiteActionTypes => ({
    type: types.UPDATE_SITE_VIEW_SEND,
    id,
    input
});

export const updateSiteViewSuccess = (payload: any) : types.SiteActionTypes => ({
    type: types.UPDATE_SITE_VIEW_SUCCESS,
    payload
});

export const updateSiteViewError = (message: string) : types.SiteActionTypes => ({
    type: types.UPDATE_SITE_VIEW_ERROR,
    payload: { message }
});
