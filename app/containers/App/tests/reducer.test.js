
import { fromJS } from 'immutable';
import AppReducer, { initialState } from '../reducer';
import { SESSION_CHECKED } from '../constants';

describe('authHeaderReducer', () => {
  it('returns the initial state', () => {
    expect(AppReducer(undefined, {})).toEqual(
      fromJS({
        sessionChecked: false,
        user: {
          default_query_string: null,
          email: null,
          first_name: null,
          id: null,
          last_name: null,
          loggedIn: false,
          search_result_columns: null,
        },
      }));
  });
  it('correctly responds to SESSION_CHECKED', () => {
    const userData = {
      default_query_string: 'foo',
      email: 'foo@bar.com',
      first_name: 'bob',
      last_name: 'e',
      loggedIn: true,
      search_result_columns: ['nct_id', 'title'],
    };
    const result = AppReducer(initialState, { type: SESSION_CHECKED, data: userData });
    expect(result.getIn(['user', 'default_query_string'])).toEqual('foo');
    expect(result.getIn(['user', 'email'])).toEqual('foo@bar.com');
    expect(result.getIn(['user', 'first_name'])).toEqual('bob');
    expect(result.getIn(['user', 'last_name'])).toEqual('e');
    expect(result.getIn(['user', 'loggedIn'])).toEqual(true);
    expect(result.getIn(['user', 'search_result_columns']).toJS()).toEqual(['nct_id', 'title']);
    expect(result.get('sessionChecked')).toEqual(true);
  });
});
