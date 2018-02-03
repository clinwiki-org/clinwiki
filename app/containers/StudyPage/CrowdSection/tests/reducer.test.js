
import { fromJS } from 'immutable';
import crowdSectionReducer from '../reducer';

describe('crowdSectionReducer', () => {
  it('returns the initial state', () => {
    expect(crowdSectionReducer(undefined, {})).toEqual(fromJS({}));
  });
});
