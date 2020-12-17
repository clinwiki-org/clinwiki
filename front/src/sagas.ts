import {spawn} from 'redux-saga/effects';
import userSagas from 'services/user/sagas';
import siteSagas from 'services/site/sagas';

export default function* sagas() {
  yield spawn(userSagas);
  yield spawn(siteSagas);
}
