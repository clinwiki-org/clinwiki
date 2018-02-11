/* eslint-disable redux-saga/yield-effects */
import { call, put, takeEvery } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import client from 'utils/client';
import { checkSession } from 'containers/App/saga';
import * as sagas from '../saga';
import * as actions from '../actions';
import * as constants from '../constants';

describe('defaultSaga Saga', () => {
  const generator = sagas.default();
  it('should subscribe to signup actions and delegate the signup saga', () => {
    expect(generator.next().value).toEqual(takeEvery(constants.SIGNUP_ACTION, sagas.signup));
  });
  it('should subscribe to login actions and delegate the login saga', () => {
    expect(generator.next().value).toEqual(takeEvery(constants.LOGIN_ACTION, sagas.login));
  });
  it('should subscribe to logout actions and delegate the logout saga', () => {
    expect(generator.next().value).toEqual(takeEvery(constants.LOGOUT_ACTION, sagas.logout));
  });
  it('should subscribe to reset actions and delegate the reset saga', () => {
    expect(generator.next().value).toEqual(takeEvery(constants.RESET_ACTION, sagas.requestReset));
  });
  it('should subscribe to reset password submit actions and delegate the reset password submit saga', () => {
    expect(generator.next().value).toEqual(takeEvery(constants.RESET_PASSWORD_SUBMIT_ACTION, sagas.doReset));
  });
});

const itChecksTheSession = (generator) => {
  it('delegates a call to check the session', () => {
    expect(generator.next().value).toEqual(call(checkSession));
  });
};

const itSendsTheUserToTheProfilePage = (generator) => {
  it('sends the user to the profile page', () => {
    expect(generator.next().value).toEqual(put(push('/profile')));
  });
};

describe('login saga', () => {
  describe('a successful call', () => {
    const generator = sagas.login({
      params: {
        email: 'foo@bar.com',
        password: 'baz',
      },
    });
    it('posts a login request to the signin page', () => {
      expect(generator.next().value).toEqual(call(client.post, '/users/sign_in', { email: 'foo@bar.com', password: 'baz' }));
    });
    it('finalizes the login on a successful response', () => {
      expect(generator.next({ data: { email: 'foo@bar.com' } }).value).toEqual(
        put(actions.loginFinalized({ email: 'foo@bar.com' })));
    });
    itChecksTheSession(generator);
    itSendsTheUserToTheProfilePage(generator);
  });
  describe('an erroneous call', () => {
    const generator = sagas.login({
      params: {
        email: 'foo@bar.com',
        password: 'baz',
      },
    });
    it('posts a login request to the signin page', () => {
      expect(generator.next().value).toEqual(call(client.post, '/users/sign_in', { email: 'foo@bar.com', password: 'baz' }));
    });
    it('broadcasts errors appropriately', () => {
      expect(generator.throw({ response: { data: 'boo' } }).value).toEqual(put(actions.loginErrors('boo')));
    });
  });
});

describe('signup saga', () => {
  const params = {
    email: 'foo@bar.com',
    password: 'baz',
    password_confirmation: 'baz',
  };
  describe('a successful call', () => {
    const generator = sagas.signup({ params });
    it('posts a login request to the signin page', () => {
      expect(generator.next().value).toEqual(call(client.post, '/users', params));
    });
    it('finalizes the login on a successful response', () => {
      expect(generator.next({ data: { email: 'foo@bar.com' } }).value).toEqual(
        put(actions.signupFinalized({ email: 'foo@bar.com' })));
    });
    itChecksTheSession(generator);
    itSendsTheUserToTheProfilePage(generator);
  });
  describe('an erroneous call', () => {
    const generator = sagas.signup({ params });
    it('posts a login request to the signin page', () => {
      expect(generator.next().value).toEqual(call(client.post, '/users', params));
    });
    it('broadcasts errors appropriately', () => {
      expect(generator.throw({ response: { data: 'boo' } }).value).toEqual(put(actions.signupErrors('boo')));
    });
  });
});

describe('doreset saga', () => {
  const params = {
    email: 'foo@bar.com',
    password: 'baz',
    password_confirmation: 'baz',
  };
  describe('a successful call', () => {
    const generator = sagas.doReset({ params });
    it('puts a password reset request to the signin page', () => {
      expect(generator.next().value).toEqual(call(client.put, '/users/password.json', params));
    });
    it('finalizes the reset on a successful response', () => {
      expect(generator.next().value).toEqual(
        put(actions.resetPasswordFinalized()));
    });
    itChecksTheSession(generator);
    itSendsTheUserToTheProfilePage(generator);
  });
  describe('an erroneous call', () => {
    const generator = sagas.doReset({ params });
    it('puts a password reset request to the signin page', () => {
      expect(generator.next().value).toEqual(call(client.put, '/users/password.json', params));
    });
    it('broadcasts errors appropriately', () => {
      expect(generator.throw({ response: { data: { errors: ['boo'] } } }).value).toEqual(put(actions.resetPasswordErrors(['boo'])));
    });
  });
});

describe('logout saga', () => {
  describe('a successful call', () => {
    const generator = sagas.logout();
    it('sends a delete request to /users/sign_out', () => {
      expect(generator.next().value).toEqual(call(client.delete, '/users/sign_out'));
    });
    it('finalizes the logout on a successful response', () => {
      expect(generator.next({}).value).toEqual(
        put(actions.logoutFinalized({})));
    });
    itChecksTheSession(generator);
  });
  describe('an erroneous call', () => {
    const generator = sagas.logout();
    it('sends a delete request to /users/sign_out', () => {
      expect(generator.next().value).toEqual(call(client.delete, '/users/sign_out'));
    });
    it('broadcasts errors appropriately', () => {
      expect(generator.throw({ response: { data: 'boo' } }).value).toEqual(put(actions.logoutErrorsAction('boo')));
    });
  });
});

describe('request reset saga', () => {
  describe('a successful call', () => {
    const generator = sagas.requestReset({
      params: { email: 'foo@bar.com' },
    });
    it('sends a put request to the password reset endpoint', () => {
      expect(generator.next().value).toEqual(call(client.put, '/users/password.json', { email: 'foo@bar.com', reset: true }));
    });
    it('broadcasts a finalize action on success', () => {
      expect(generator.next({}).value).toEqual(put(actions.resetFinalized({})));
    });
  });
  describe('an erroneous call', () => {
    const generator = sagas.requestReset({
      params: { email: 'foo@bar.com' },
    });
    it('sends a put request to the password reset endpoint', () => {
      expect(generator.next().value).toEqual(call(client.put, '/users/password.json', { email: 'foo@bar.com', reset: true }));
    });
    it('broadcasts a reset error action on error', () => {
      expect(generator.throw({ response: { data: { errors: ['foo'] } } }).value).toEqual(
        put(actions.resetErrors(['foo'])));
    });
  });
});
