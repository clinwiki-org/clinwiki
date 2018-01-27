
import { fromJS } from 'immutable';
import loginSignupReducer from '../reducer';

describe('loginSignupReducer', () => {
  it('returns the initial state', () => {
    expect(loginSignupReducer(undefined, {})).toEqual(fromJS({}));
  });
});
