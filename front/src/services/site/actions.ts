import * as types from './types';
import { AdminViewsProviderQuery } from 'types/AdminViewsProviderQuery';

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
