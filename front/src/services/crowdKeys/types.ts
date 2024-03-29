import { SiteFragment as SiteProviderQuery } from 'services/site/model/SiteFragment';
import { SitesPageQuery } from '../site/model/SitesPageQuery';
import { UpdateSiteInput } from 'services/site/model/InputTypes';

export const INSERT_CROWD_KEY_VALUE_ID_SEND = 'INSERT_CROWD_KEY_VALUE_ID_SEND';
export const INSERT_CROWD_KEY_VALUE_ID_SUCCESS =
    'INSERT_CROWD_KEY_VALUE_ID_SUCCESS';
export const INSERT_CROWD_KEY_VALUE_ID_ERROR =
    'INSERT_CROWD_KEY_VALUE_ID_ERROR';

export const DELETE_CROWD_KEY_VALUE_ID_SEND = 'DELETE_CROWD_KEY_VALUE_ID_SEND';
export const DELETE_CROWD_KEY_VALUE_ID_SUCCESS =
    'DELETE_CROWD_KEY_VALUE_ID_SUCCESS';
export const DELETE_CROWD_KEY_VALUE_ID_ERROR =
    'DELETE_CROWD_KEY_VALUE_ID_ERROR';

export const UPDATE_CROWD_KEY_VALUE_ID_SEND = 'UPDATE_CROWD_KEY_VALUE_ID_SEND';
export const UPDATE_CROWD_KEY_VALUE_ID_SUCCESS =
    'UPDATE_CROWD_KEY_VALUE_ID_SUCCESS';
export const UPDATE_CROWD_KEY_VALUE_ID_ERROR =
    'UPDATE_CROWD_KEY_VALUE_ID_ERROR';

export interface CrowdKeyState {
    isUpdatingCrowdKeyValueId: boolean;
}

export interface SiteDataError {
    message: string;
}

export interface InsertCrowdKeyValueIdSendAction {
    type: typeof INSERT_CROWD_KEY_VALUE_ID_SEND;
    crowdKeyValueId: string;
    crowdValue: string;
    crowdKey: string;
    userId: any;
    verified: boolean;
    approved: boolean;
}

export interface InsertCrowdKeyValueIdSuccessAction {
    type: typeof INSERT_CROWD_KEY_VALUE_ID_SUCCESS;
    payload: SitesPageQuery;
}

export interface InsertCrowdKeyValueIdErrorAction {
    type: typeof INSERT_CROWD_KEY_VALUE_ID_ERROR;
    payload: SiteDataError;
}
export interface DeleteCrowdKeyValueIdSendAction {
    type: typeof DELETE_CROWD_KEY_VALUE_ID_SEND;
    crowdKeyValueId: string;
    crowdValue: string;
    crowdKey: string;
}

export interface DeleteCrowdKeyValueIdSuccessAction {
    type: typeof DELETE_CROWD_KEY_VALUE_ID_SUCCESS;
    payload: SitesPageQuery;
}

export interface DeleteCrowdKeyValueIdErrorAction {
    type: typeof DELETE_CROWD_KEY_VALUE_ID_ERROR;
    payload: SiteDataError;
}

export interface UpdateCrowdKeyValueIdSendAction {
    type: typeof UPDATE_CROWD_KEY_VALUE_ID_SEND;
    crowdKeyValueIdPK: number;
    crowdValue: string;
    crowdKeyValueId: string;
}

export interface UpdateCrowdKeyValueIdSuccessAction {
    type: typeof UPDATE_CROWD_KEY_VALUE_ID_SUCCESS;
    payload: SitesPageQuery;
}

export interface UpdateCrowdKeyValueIdErrorAction {
    type: typeof UPDATE_CROWD_KEY_VALUE_ID_ERROR;
    payload: SiteDataError;
}

export type HasuraSiteActionTypes =
    | InsertCrowdKeyValueIdSendAction
    | InsertCrowdKeyValueIdSuccessAction
    | InsertCrowdKeyValueIdErrorAction
    | DeleteCrowdKeyValueIdSendAction
    | DeleteCrowdKeyValueIdSuccessAction
    | DeleteCrowdKeyValueIdErrorAction
    | UpdateCrowdKeyValueIdSendAction
    | UpdateCrowdKeyValueIdSuccessAction
    | UpdateCrowdKeyValueIdErrorAction;
