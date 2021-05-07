import * as types from './types';

export const insertCrowdKeyValueId = (crowdKeyValueId: string, crowdValue: string, crowdKey:string, userId: any, verified: boolean, approved: boolean) : types.HasuraSiteActionTypes => ({
    type: types.INSERT_CROWD_KEY_VALUE_ID_SEND,
    crowdKeyValueId,
     crowdValue,
      crowdKey, 
      userId, 
      verified,
      approved,
});

export const insertCrowdKeyValueIdSuccess = (payload: any) : types.HasuraSiteActionTypes => ({
    type: types.INSERT_CROWD_KEY_VALUE_ID_SUCCESS,
    payload
});

export const insertCrowdKeyValueIdError = (message: string) : types.HasuraSiteActionTypes => ({
    type: types.INSERT_CROWD_KEY_VALUE_ID_ERROR,
    payload: { message }
});
export const deleteCrowdKeyValueId = (crowdKeyValueId: string, crowdValue: string, crowdKey:string) : types.HasuraSiteActionTypes => ({
    type: types.DELETE_CROWD_KEY_VALUE_ID_SEND,
    crowdKeyValueId,
     crowdValue,
      crowdKey, 
});

export const deleteCrowdKeyValueIdSuccess = (payload: any) : types.HasuraSiteActionTypes => ({
    type: types.DELETE_CROWD_KEY_VALUE_ID_SUCCESS,
    payload
});

export const deleteCrowdKeyValueIdError = (message: string) : types.HasuraSiteActionTypes => ({
    type: types.DELETE_CROWD_KEY_VALUE_ID_ERROR,
    payload: { message }
});

