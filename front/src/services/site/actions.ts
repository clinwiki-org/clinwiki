import * as types from './types';

import { SitesPageQuery } from 'services/site/model/SitesPageQuery';
import { AdminViewsProviderQuery } from 'services/site/model/AdminViewsProviderQuery';

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
