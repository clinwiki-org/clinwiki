
import { fromJS } from 'immutable';
import wikiSectionReducer from '../reducer';

describe('wikiSectionReducer', () => {
  it('returns the initial state', () => {
    expect(wikiSectionReducer(undefined, {})).toEqual(fromJS({}));
  });
});
