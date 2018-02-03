import { take, call, put, cancel, takeEvery } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import client from 'utils/client';
import {
  RELOAD_STUDY_ACTION,
} from '../constants';
import { wikiUrl } from '../saga';
import {
  ANNOTATION_CREATE,
  ANNOTATION_DELETE,
  ANNOTATION_UPDATE,
} from './constants';

export default function* annotationsSaga() {
  const createAnnotationWatcher = yield takeEvery(ANNOTATION_CREATE, postAnnotation);
  const deleteAnnotationWatcher = yield takeEvery(ANNOTATION_DELETE, deleteAnnotation);
  const updateAnnotationWatcher = yield takeEvery(ANNOTATION_UPDATE, postAnnotation);

  yield take(LOCATION_CHANGE);

  yield cancel(createAnnotationWatcher);
  yield cancel(deleteAnnotationWatcher);
  yield cancel(updateAnnotationWatcher);
}

export function* postAnnotation(action) {
  yield call(client.post, wikiUrl(action), { add_meta: action });
  yield put({ type: RELOAD_STUDY_ACTION, nctId: action.nctId });
}

export function* deleteAnnotation(action) {
  yield call(client.post, wikiUrl(action), { delete_meta: { key: action.key } });
  yield put({ type: RELOAD_STUDY_ACTION, nctId: action.nctId });
}
