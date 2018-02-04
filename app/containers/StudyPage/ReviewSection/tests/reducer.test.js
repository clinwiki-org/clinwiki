
import { fromJS } from 'immutable';
import reviewSectionReducer from '../reducer';

describe('reviewSectionReducer', () => {
  it('returns the initial state', () => {
    expect(reviewSectionReducer(undefined, {})).toEqual(fromJS({}));
  });
});
