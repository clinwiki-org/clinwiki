import { AdminViewsProviderQuery } from 'types/AdminViewsProviderQuery';

export const FETCH_ADMIN_SITE_VIEW_SEND = 'FETCH_ADMIN_SITE_VIEW_SEND';
export const FETCH_ADMIN_SITE_VIEW_SUCCESS = 'FETCH_ADMIN_SITE_VIEW_SUCCESS';
export const FETCH_ADMIN_SITE_VIEW_ERROR = 'FETCH_ADMIN_SITE_VIEW_ERROR';

export interface SiteState {
    isFetchingAdminSiteView: boolean,
    adminSiteView: AdminViewsProviderQuery | undefined;
}

export interface SiteDataError {
    message: string
};

export interface FetchAdminSiteViewSendAction {
    type: typeof FETCH_ADMIN_SITE_VIEW_SEND
};

export interface FetchAdminSiteViewSuccessAction {
    type: typeof FETCH_ADMIN_SITE_VIEW_SUCCESS,
    payload: AdminViewsProviderQuery
};

export interface FetchAdminSiteViewErrorAction {
    type: typeof FETCH_ADMIN_SITE_VIEW_ERROR,
    payload: SiteDataError
};

export type SiteActionTypes = FetchAdminSiteViewSendAction | FetchAdminSiteViewSuccessAction | FetchAdminSiteViewErrorAction;
