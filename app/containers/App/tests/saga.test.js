/* eslint-disable redux-saga/yield-effects */
import { call, put, takeEvery } from 'redux-saga/effects';
import client from 'utils/client';
import {
  SESSION_CHECKED,
  RELOAD_SESSION,
} from '../constants';
import defaultSaga, { checkSession } from '../saga';

describe('defaultSaga', () => {
  const appSaga = defaultSaga();
  it('should check session', () => {
    expect(appSaga.next().value).toEqual(call(checkSession));
  });
  it('should watch for session reload actions', () => {
    expect(appSaga.next().value).toEqual(takeEvery(RELOAD_SESSION, checkSession));
  });
});

describe('checkSession', () => {
  const checkSessionGenerator = checkSession();
  it('should make a request to /user/exists', () => {
    expect(checkSessionGenerator.next().value).toEqual(call(client.get, '/user/exists'));
  });
  it('should broadcast session data with the SESSION_CHECKED action', () => {
    expect(checkSessionGenerator.next({
      data: { user: { email: 'foo@bar.com' } },
    }).value).toEqual(put({ type: SESSION_CHECKED, data: { user: { email: 'foo@bar.com' } } }));
  });
});
