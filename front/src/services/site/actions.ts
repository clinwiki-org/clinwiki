import * as types from './types';

import {
    CopySiteViewInput,
    CreateSiteInput,
    CreateSiteViewInput,
    DeleteSiteViewInput,
    UpdateSiteInput,
    UpdateSiteViewInput,
} from 'services/site/model/InputTypes';

import { AdminViewsProviderQuery } from 'services/site/model/AdminViewsProviderQuery';
import { PresentSiteFragment as PresentSiteProviderQuery } from 'services/site/model/PresentSiteFragment';
import { SiteFragment as SiteProviderQuery } from 'services/site/model/SiteFragment';
import { SitesPageQuery } from 'services/site/model/SitesPageQuery';
import { last } from 'ramda';


export const fetchHasuraPresentSiteProvider = (
    history?: any,
    url?: string
): types.SiteActionTypes =>
    //console.log("ACTION Present Site Provider", url),
    ({
        history,
        type: types.FETCH_HASURA_PRESENT_SITE_PROVIDER_SEND,
        url,
    });

export const fetchHasuraPresentSiteProviderSuccess = (
    payload: PresentSiteProviderQuery
): types.SiteActionTypes => ({
    type: types.FETCH_HASURA_PRESENT_SITE_PROVIDER_SUCCESS,
    payload,
});

export const fetchHasuraPresentSiteProviderError = (
    message: string
): types.SiteActionTypes => ({
    type: types.FETCH_HASURA_PRESENT_SITE_PROVIDER_ERROR,
    payload: { message },
});
