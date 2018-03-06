import { fromJS } from 'immutable';
import { selectProfilePageDomain } from '../selectors';
import { initialState } from '../reducer';

describe('selectProfilePageDomain', () => {
  it('Expect to have unit tests specified', () => {
    expect(Object.keys(selectProfilePageDomain(fromJS({ profilePage: initialState })).toJS())).toEqual(['fields']);
  });
});
