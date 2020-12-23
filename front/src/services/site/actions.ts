import * as types from './types';

//@ts-ignore
import { AdminViewsProviderQuery } from 'types/AdminViewsProviderQuery';
import { SitesPageQuery } from 'types/SitesPageQuery';


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
