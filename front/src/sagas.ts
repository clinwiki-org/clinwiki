import {spawn} from 'redux-saga/effects';
import userSagas from 'services/user/sagas';
import siteSagas from 'services/site/sagas';
import searchSagas from 'services/search/sagas';

export default function* sagas() {
  yield spawn(userSagas);
  yield spawn(siteSagas);
  yield spawn(searchSagas);
}
