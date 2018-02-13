/* eslint-disable redux-saga/yield-effects */
import { call, put, takeEvery } from 'redux-saga/effects';
import * as sagas from '../saga';
import * as actions from '../actions';
import * as constants from '../constants';


describe('default saga', () => {
  const generator = sagas.default();
  it('triggers a search on search changed', () => {
    expect(generator.next().value).toEqual(takeEvery(constants.SEARCH_CHANGED, sagas.doSearch));
  });
  it('loads an agg on agg viewed', () => {
    expect(generator.next().value).toEqual(takeEvery(constants.AGG_VIEWED, sagas.loadAgg));
  });
  it('handles fetched data', () => {
    expect(generator.next().value).toEqual(takeEvery(constants.DATA_FETCHED, sagas.dataFetched));
  });
  it('updates aggs on agg selected', () => {
    expect(generator.next().value).toEqual(takeEvery(constants.AGG_SELECTED, sagas.handleAgg));
  });
  it('updates aggs on agg removed', () => {
    expect(generator.next().value).toEqual(takeEvery(constants.AGG_REMOVED, sagas.handleAgg));
  });
});

describe('handleAgg', () => {
  const someAction = { type: 'some action', some: 'action' };
  const generator = sagas.handleAgg(someAction);
  it('sets the search view to loading', () => {
    expect(generator.next(someAction).value).toEqual(put(actions.searchLoading()));
  });
  it('passes the action along to doSearch', () => {
    expect(generator.next(someAction).value).toEqual(call(sagas.doSearch, someAction));
  });
});

describe('dataFetched', () => {
  it('performs a search if the state is different', () => {
    const data = { state: { foo: 'bar' } };
    const generator = sagas.dataFetched(data);
    // check search selector
    generator.next(data);
    expect(generator.next({ params: { baz: 'qux' } }).value).toEqual(put(actions.searchLoading()));
    expect(generator.next().value).toEqual(call(sagas.doSearch, data));
  });
});
