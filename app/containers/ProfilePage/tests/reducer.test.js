
import { fromJS } from 'immutable';
import { populateColumnPickerAction } from '../actions';
import profilePageReducer from '../reducer';

describe('profilePageReducer', () => {
  it('returns the initial state', () => {
    expect(profilePageReducer(undefined, {})).toEqual(fromJS({
      fields: [],
    }));
  });
  it('populates column picker fields', () => {
    expect(profilePageReducer(fromJS({}), populateColumnPickerAction(['foo', 'bar']))).toEqual(fromJS({
      fields: ['foo', 'bar'],
    }));
  });
});
