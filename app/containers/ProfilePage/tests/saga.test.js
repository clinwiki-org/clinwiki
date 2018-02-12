import { push } from 'react-router-redux';
/* eslint-disable redux-saga/yield-effects */
import { takeEvery, call, put } from 'redux-saga/effects';
import client from 'utils/client';
import {
  SUBMIT_PROFILE_ACTION,
} from '../constants';
import { populateColumnPickerAction, submitProfileErrorsAction, submitProfile } from '../actions';
import * as sagas from '../saga';

describe('ProfilePage sagas', () => {
  describe('default saga', () => {
    const generator = sagas.default();
    it('immediately triggers a populate column picker action', () => {
      expect(generator.next().value).toEqual(call(sagas.populateColumnPicker));
    });
    it('delegates submit profile actions to the submit profile saga', () => {
      expect(generator.next().value).toEqual(takeEvery(SUBMIT_PROFILE_ACTION, sagas.submitProfile));
    });
  });
  describe('populateColumnPicker saga', () => {
    const generator = sagas.populateColumnPicker();
    it('sends a request for fields', () => {
      expect(generator.next().value).toEqual(call(client.get, '/studies/fields'));
    });
    it('calls the populateColumnPickerAction', () => {
      expect(generator.next({ data: ['foo', 'bar'] }).value).toEqual(put(populateColumnPickerAction(['foo', 'bar'])));
    });
  });
  describe('submitProfile saga', () => {
    const userData = { data: { first_name: 'foo', last_name: 'bar' } };
    describe('with a successful request', () => {
      const generator = sagas.submitProfile(submitProfile(userData));
      it('puts data to the users endpoint', () => {
        expect(
          generator.next().value
        ).toEqual(
          call(client.patch, '/users.json', userData)
        );
      });
      it('sends the user to the homepage', () => {
        expect(generator.next().value).toEqual(put(push('/')));
      });
    });
    describe('with a failed request', () => {
      const generator = sagas.submitProfile(submitProfile(userData));
      generator.next();
      it('records the error', () => {
        expect(generator.throw({ error: 'foo' }).value).toEqual(put(submitProfileErrorsAction({ error: 'foo' })));
      });
    });
  });
});
