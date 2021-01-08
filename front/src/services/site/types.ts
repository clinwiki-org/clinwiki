import { SiteFragment as SiteProviderQuery } from 'services/site/model/SiteFragment';
import { CreateSiteInput, UpdateSiteInput } from 'services/site/model/InputTypes';
import { SitesPageQuery } from 'services/site/model/SitesPageQuery';
import { AdminViewsProviderQuery } from 'services/site/model/AdminViewsProviderQuery';
import { CreateSiteViewInput, UpdateSiteViewInput } from 'services/site/model/InputTypes';

export const FETCH_ADMIN_SITE_VIEW_SEND = 'FETCH_ADMIN_SITE_VIEW_SEND';
export const FETCH_ADMIN_SITE_VIEW_SUCCESS = 'FETCH_ADMIN_SITE_VIEW_SUCCESS';
export const FETCH_ADMIN_SITE_VIEW_ERROR = 'FETCH_ADMIN_SITE_VIEW_ERROR';

export const FETCH_SITES_PAGE_SEND = 'FETCH_SITES_PAGE_SEND';
export const FETCH_SITES_PAGE_SUCCESS = 'FETCH_SITES_PAGE_SUCCESS';
export const FETCH_SITES_PAGE_ERROR = 'FETCH_SITES_PAGE_ERROR';

export const FETCH_SITE_PROVIDER_SEND = 'FETCH_SITE_PROVIDER_SEND';
export const FETCH_SITE_PROVIDER_SUCCESS = 'FETCH_SITE_PROVIDER_SUCCESS';
export const FETCH_SITE_PROVIDER_ERROR = 'FETCH_SITE_PROVIDER_ERROR';

export const DELETE_SITE_SEND = 'DELETE_SITE_SEND';
export const DELETE_SITE_SUCCESS = 'DELETE_SITE_SUCCESS';
export const DELETE_SITE_ERROR = 'DELETE_SITE_ERROR';

export const CREATE_SITE_SEND = 'CREATE_SITE_SEND';
export const CREATE_SITE_SUCCESS = 'CREATE_SITE_SUCCESS';
export const CREATE_SITE_ERROR = 'CREATE_SITE_ERROR';

export const UPDATE_SITE_SEND = 'UPDATE_SITE_SEND';
export const UPDATE_SITE_SUCCESS = 'UPDATE_SITE_SUCCESS';
export const UPDATE_SITE_ERROR = 'UPDATE_SITE_ERROR';

export const UPDATE_SITE_VIEW_SEND = 'UPDATE_SITE_SEND';
export const UPDATE_SITE_VIEW_SUCCESS = 'UPDATE_SITE_SUCCESS';
export const UPDATE_SITE_VIEWERROR = 'UPDATE_SITE_ERROR';

export interface SiteState {
    isFetchingAdminSiteView: boolean,
    adminSiteView: AdminViewsProviderQuery | undefined,
    isFetchingSitesPage: boolean,
    sitesData: any | SitesPageQuery | undefined,
    isDeletingSite: boolean,
    isCreatingSite: boolean,
    isUpdatingSite: boolean,
    isFetchingSiteProvider: boolean,
    isUpdatingSiteView: boolean,
    siteProvider: SiteProviderQuery | undefined,
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

export interface FetchSitesPageSendAction {
    type: typeof FETCH_SITES_PAGE_SEND
};

export interface FetchSitesPageSuccessAction {
    type: typeof FETCH_SITES_PAGE_SUCCESS,
    payload: SitesPageQuery
};

export interface FetchSitesPageErrorAction {
    type: typeof FETCH_SITES_PAGE_ERROR,
    payload: SiteDataError
};

export interface FetchSiteProviderSendAction {
    type: typeof FETCH_SITE_PROVIDER_SEND,
    id?: number,
    url?: string
};

export interface FetchSiteProviderSuccessAction {
    type: typeof FETCH_SITE_PROVIDER_SUCCESS,
    payload: SiteProviderQuery
};

export interface FetchSiteProviderErrorAction {
    type: typeof FETCH_SITE_PROVIDER_ERROR,
    payload: SiteDataError
};


export interface DeleteSiteSendAction {
    type: typeof DELETE_SITE_SEND,
    id: number
}

export interface DeleteSiteSuccessAction {
    type: typeof DELETE_SITE_SUCCESS,
    payload: SitesPageQuery
};

export interface DeleteSiteErrorAction {
    type: typeof DELETE_SITE_ERROR,
    payload: SiteDataError
};

export interface CreateSiteSendAction {
    type: typeof CREATE_SITE_SEND,
    input: CreateSiteInput,
    url?: string
}

export interface CreateSiteSuccessAction {
    type: typeof CREATE_SITE_SUCCESS,
    payload: SitesPageQuery
};

export interface CreateSiteErrorAction {
    type: typeof CREATE_SITE_ERROR,
    payload: SiteDataError
};

export interface UpdateSiteSendAction {
    type: typeof UPDATE_SITE_SEND,
    input: UpdateSiteInput,
    url?: string
}

export interface UpdateSiteSuccessAction {
    type: typeof UPDATE_SITE_SUCCESS,
    payload: SitesPageQuery
};

export interface UpdateSiteErrorAction {
    type: typeof UPDATE_SITE_ERROR,
    payload: SiteDataError
};

export interface UpdateSiteViewSendAction {
    type: typeof UPDATE_SITE_SEND,
    input: UpdateSiteInput,
    url?: string
}

export interface UpdateSiteViewSuccessAction {
    type: typeof UPDATE_SITE_SUCCESS,
    payload: SitesPageQuery
};

export interface UpdateSiteViewErrorAction {
    type: typeof UPDATE_SITE_ERROR,
    payload: SiteDataError
};


export type SiteActionTypes = FetchAdminSiteViewSendAction | FetchAdminSiteViewSuccessAction | FetchAdminSiteViewErrorAction |
    FetchSitesPageSendAction | FetchSitesPageSuccessAction | FetchSitesPageErrorAction | DeleteSiteSendAction | DeleteSiteSuccessAction |
    DeleteSiteErrorAction  | CreateSiteSendAction | CreateSiteSuccessAction | CreateSiteErrorAction  
    | UpdateSiteSendAction | UpdateSiteSuccessAction | UpdateSiteErrorAction | FetchSiteProviderSendAction | FetchSiteProviderSuccessAction | FetchSiteProviderErrorAction | UpdateSiteViewSendAction | UpdateSiteViewSuccessAction | UpdateSiteViewErrorAction;
