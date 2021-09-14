import {spawn} from 'redux-saga/effects';
import userSagas from 'services/user/sagas';
import siteSagas from 'services/site/sagas';
import searchSagas from 'services/search/sagas';
import studySagas from 'services/study/sagas';
import introspectionSagas from 'services/introspection/sagas';
import hasuraSiteSagas from 'services/hasuraSite/sagas';
import crowdKeysSagas from 'services/crowdKeys/sagas';
import adminSagas from 'services/admin/sagas';
import genericPageSagas from 'services/genericPage/sagas';

export default function* sagas() {
  yield spawn(userSagas);
  yield spawn(siteSagas);
  yield spawn(searchSagas);
  yield spawn(studySagas);
  yield spawn(introspectionSagas);
  yield spawn(hasuraSiteSagas);
  yield spawn(crowdKeysSagas);
  yield spawn(adminSagas);
  yield spawn(genericPageSagas);
}
