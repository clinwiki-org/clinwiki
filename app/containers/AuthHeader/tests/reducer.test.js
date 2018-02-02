
import { fromJS } from 'immutable';
import authHeaderReducer from '../reducer';

describe('authHeaderReducer', () => {
  it('returns the initial state', () => {
    expect(authHeaderReducer(undefined, {})).toEqual(fromJS({}));
  });
});
