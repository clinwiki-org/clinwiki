
import { fromJS } from 'immutable';
import loginSignupPageReducer from '../reducer';

describe('loginSignupPageReducer', () => {
  it('returns the initial state', () => {
    expect(loginSignupPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
