
import { fromJS } from 'immutable';
import SearchPageReducer from '../reducer';

describe('SearchPageReducer', () => {
  it('returns the initial state', () => {
    expect(SearchPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
