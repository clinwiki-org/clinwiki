import {spawn} from 'redux-saga/effects';
import userSagas from 'services/user/sagas';
import siteSagas from 'services/site/sagas';
import searchSagas from 'services/search/sagas';
import studySagas from 'services/study/sagas';

export default function* sagas() {
  yield spawn(userSagas);
  yield spawn(siteSagas);
  yield spawn(searchSagas);
  yield spawn(studySagas);
}
