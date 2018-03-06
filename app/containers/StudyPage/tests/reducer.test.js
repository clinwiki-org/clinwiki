
import { fromJS } from 'immutable';
import studyPageReducer from '../reducer';

describe('studyPageReducer', () => {
  it('returns the initial state', () => {
    expect(studyPageReducer(undefined, {})).toEqual(fromJS({ wikiOverride: true }));
  });
});
