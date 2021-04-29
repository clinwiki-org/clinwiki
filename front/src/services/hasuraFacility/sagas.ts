import { call, put, takeLatest } from 'redux-saga/effects';
import * as api from './api';
import * as actions from './actions';
import * as types from './types';

function* getFacilitiesPageHasura(action) {
    try {
      let response = yield call(() => api.fetchFacilitiesPageHasura(action.nctId));
      if (response) {
        yield put(actions.fetchFacilitiesPageHasuraSuccess(response));
      } else {
        yield put(actions.fetchFacilitiesPageHasuraError(response.message));
      }
    } catch (err) {
      console.log(err);
      yield put(actions.fetchFacilitiesPageHasuraError(err.message));
    }
  }

export default function* userSagas() {
    yield takeLatest(types.FETCH_FACILITIES_PAGE_HASURA_SEND, getFacilitiesPageHasura);
}