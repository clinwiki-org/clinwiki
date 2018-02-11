
import { fromJS } from 'immutable';
import * as constants from '../constants';
import loginSignupPageReducer from '../reducer';

describe('loginSignupPageReducer', () => {
  it('returns the initial state', () => {
    expect(loginSignupPageReducer(undefined, {})).toEqual(fromJS({
      errors: null,
      resetSent: false,
    }));
  });
  describe('finalization actions', () => {
    const itResetsState = (type) => expect(loginSignupPageReducer(fromJS({
      errors: 'some error',
      resetSent: true,
    }), { type })).toEqual(fromJS({
      errors: null,
      resetSent: false,
    }));
    itResetsState(constants.LOGIN_FINALIZED_ACTION);
    itResetsState(constants.SIGNUP_FINALIZED_ACTION);
    itResetsState(constants.RESET_PASSWORD_FINALIZED_ACTION);
  });
  describe('error actions', () => {
    const itStoresTheErrors = (type, errors) => expect(loginSignupPageReducer(fromJS({
      errors: null,
      resetSent: false,
    }), { type, errors })).toEqual(fromJS({
      errors,
      resetSent: false,
    }));
    itStoresTheErrors(constants.LOGIN_ERRORS_ACTION, fromJS(['this one']));
    itStoresTheErrors(constants.SIGNUP_ERRORS_ACTION, fromJS(['this one']));
    itStoresTheErrors(constants.RESET_PASSWORD_ERRORS_ACTION, fromJS(['this one']));
  });
  describe('reset finalized action', () => {
    expect(loginSignupPageReducer(fromJS({
      errors: null,
      resetSent: false,
    }), { type: constants.RESET_FINALIZED_ACTION })).toEqual(fromJS({
      errors: null,
      resetSent: true,
    }));
  });
});
