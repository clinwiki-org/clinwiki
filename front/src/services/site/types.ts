import {
    CopySiteViewInput,
    CreateSiteViewInput,
    DeleteSiteViewInput,
    UpdateSiteViewInput,
} from 'services/site/model/InputTypes';
import {
    CreateSiteInput,
    UpdateSiteInput,
} from 'services/site/model/InputTypes';

import { AdminViewsProviderQuery } from 'services/site/model/AdminViewsProviderQuery';
import { PresentSiteFragment as PresentSiteProviderQuery } from 'services/site/model/PresentSiteFragment';
import { SiteFragment as SiteProviderQuery } from 'services/site/model/SiteFragment';
import { SitesPageQuery } from 'services/site/model/SitesPageQuery';


export const FETCH_HASURA_PRESENT_SITE_PROVIDER_SEND =
    'FETCH_HASURA_PRESENT_SITE_PROVIDER_SEND';
export const FETCH_HASURA_PRESENT_SITE_PROVIDER_SUCCESS =
    'FETCH_HASURA_PRESENT_SITE_PROVIDER_SUCCESS';
export const FETCH_HASURA_PRESENT_SITE_PROVIDER_ERROR =
    'FETCH_HASURA_PRESENT_SITE_PROVIDER_ERROR';


export interface SiteState {
    isFetchingAdminSiteView: boolean;
    adminSiteView: AdminViewsProviderQuery | undefined;
    isFetchingSitesPage: boolean;
    isFetchingSitesPageHasura: boolean;
    sitesData: any | SitesPageQuery | undefined;
    isDeletingSite: boolean;
    isCreatingSite: boolean;
    isUpdatingSite: boolean;
    isFetchingSiteProvider: boolean;
    isCopyingSiteView: boolean;
    isCreatingSiteView: boolean;
    isDeletingSiteView: boolean;
    isUpdatingSiteView: boolean;
    siteProvider: any | SiteProviderQuery | undefined;
    isFetchingPresentSiteProvider: boolean;
    presentSiteProvider: PresentSiteProviderQuery | undefined;
    isFetchingHasuraPresentSiteProvider: boolean;
    hasuraPresentSiteProvider: any | undefined;
}

export interface SiteDataError {
    message: string;
}



export interface FetchHasuraPresentSiteProviderSendAction {
    type: typeof FETCH_HASURA_PRESENT_SITE_PROVIDER_SEND;
    history?: any;
    id?: number;
    url?: string;
}

export interface FetchHasuraPresentSiteProviderSuccessAction {
    type: typeof FETCH_HASURA_PRESENT_SITE_PROVIDER_SUCCESS;
    payload: any;
}

export interface FetchHasuraPresentSiteProviderErrorAction {
    type: typeof FETCH_HASURA_PRESENT_SITE_PROVIDER_ERROR;
    payload: SiteDataError;
}


export type SiteActionTypes =

    | FetchHasuraPresentSiteProviderSendAction
    | FetchHasuraPresentSiteProviderSuccessAction
    | FetchHasuraPresentSiteProviderErrorAction;
