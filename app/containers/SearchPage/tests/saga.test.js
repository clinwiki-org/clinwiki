/* eslint-disable redux-saga/yield-effects */
import { call, put, takeEvery } from 'redux-saga/effects';
import client from 'utils/client';
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

describe('loadAgg', () => {
  const action = { agg: 'foo' };
  let searchSelectorResult;
  const generatorFunc = () => sagas.loadAgg(action);
  describe('if the agg has already been loaded', () => {
    const generator = generatorFunc();
    // selector
    generator.next();
    it('finishes without querying the backend', () => {
      expect(generator.next({ aggs: { foo: { loaded: true, buckets: [] } } }).done).toBeTruthy();
    });
  });
  describe('if the agg has not already been loaded', () => {
    searchSelectorResult = { aggs: { foo: { buckets: [] } } };
    describe('on a successful call', () => {
      const generator = generatorFunc();
      // selector
      generator.next();
      it('retrieves params from the selector', () => {
        expect(generator.next(searchSelectorResult).value).toEqual(call(sagas.getParams, searchSelectorResult, action));
      });
      it('queries the backend', () => {
        expect(generator.next({ some: 'params' }).value).toEqual(call(
          client.post,
          '/studies/agg_buckets',
          Object.assign({}, { some: 'params' }, { agg: 'foo' }),
        ));
      });
      it('broadcasts the results to the aggLoaded action', () => {
        expect(generator.next({ data: { whatever: 'results' } }).value).toEqual(
          put(actions.aggLoaded('foo', { whatever: 'results' })));
      });
    });
    describe('on an unsuccessful call', () => {
      const generator = generatorFunc();
      // selector
      generator.next();
      it('retrieves params from the selector', () => {
        expect(generator.next(searchSelectorResult).value).toEqual(call(sagas.getParams, searchSelectorResult, action));
      });
      it('queries the backend', () => {
        expect(generator.next({ some: 'params' }).value).toEqual(call(
          client.post,
          '/studies/agg_buckets',
          Object.assign({}, { some: 'params' }, { agg: 'foo' }),
        ));
      });
      it('broadcasts the error to the aggLoadedError action', () => {
        const err = Error('some error');
        expect(generator.throw(err).value).toEqual(put(actions.aggLoadedError('foo', err)));
      });
    });
  });
  describe('getParams', () => {
    const searchPage = {
      searchQuery: 'foo',
      params: {
        pageSize: 0,
        sorted: ['nct_id'],
        page: 1,
      },
      aggFilters: { foo: ['bar'] },
    };
    const data = {
      state: {
        pageSize: 10,
        sorted: ['nct_id', 'title'],
        page: 2,
      },
    };
    const authheader = {
      user: { search_result_columns: { nct_id: 1, title: 1 } },
    };
    const generator = sagas.getParams(searchPage, data);
    it('retrieves user data from the auth header', () => {
      expect(generator.next().value).toBeTruthy();
    });
    it('composes search params from the existing state, user prefs, and the request', () => {
      expect(generator.next(authheader).value).toEqual({
        q: 'foo',
        pageSize: 10,
        sorted: ['nct_id', 'title'],
        page: 2,
        aggFilters: { foo: ['bar'] },
        selectedColumns: ['nct_id', 'title'],
      });
    });
  });
});
describe('doSearch', () => {
  let generator;
  let searchPage;
  const shouldGetParams = (gen, sp, data, yielded = null) => expect(gen.next(yielded).value).toEqual(call(sagas.getParams, sp, data));
  const shouldPostParams = (gen, url, params) => expect(gen.next(params).value).toEqual(call(client.post, url, params));
  const shouldLoadSearch = (gen, yielded, result) => expect(gen.next(yielded).value).toEqual(put(actions.searchLoaded(result)));
  const shouldBroadcastError = (gen) => expect(gen.throw(Error('foo')).value).toEqual(put(actions.searchLoadedError(Error('foo'))));
  describe('with a SEARCH_CHANGED action', () => {
    describe('if a search query is passed in the action', () => {
      const action = { type: constants.SEARCH_CHANGED, searchQuery: 'foo', state: { some: 'state' } };
      beforeEach(() => {
        searchPage = { searchQuery: 'foo' };
        generator = sagas.doSearch(action);
        // search selector
        generator.next();
      });
      describe('if the search query is different from the previous query', () => {
        beforeEach(() => {
          searchPage = { searchQuery: 'bar' };
        });
        it('clears the previous search data', () => {
          expect(generator.next(searchPage).value).toEqual(put(actions.clearSearchData()));
        });
      });
      describe('with a successful request', () => {
        it('gets params, posts to the search endpoint, and brodcasts the search result action', () => {
          shouldGetParams(generator, searchPage, action, searchPage);
          shouldPostParams(generator, '/studies/search/foo/json', { any: 'params' });
          shouldLoadSearch(generator, { data: { some: 'data' } }, { searchQuery: 'foo', some: 'data', state: { some: 'state' } });
        });
      });
      describe('with an unsuccessful request', () => {
        it('gets params, posts to search endpoint, and captures error', () => {
          shouldGetParams(generator, searchPage, action, searchPage);
          shouldPostParams(generator, '/studies/search/foo/json', { any: 'params' });
          shouldBroadcastError(generator);
        });
      });
    });
  });
  describe('without a SEARCH_CHANGED action', () => {
    let action;
    beforeEach(() => {
      action = { type: 'some other', searchQuery: 'foo', state: { some: 'state' } };
      generator = sagas.doSearch(action);
      // search selector
      generator.next();
    });
    describe('if a search query is passed in the action', () => {
      describe('with a successful request', () => {
        it('gets params, posts to the search endpoint, and brodcasts the search result action', () => {
          shouldGetParams(generator, searchPage, action, searchPage);
          shouldPostParams(generator, '/studies/search/foo/json', { any: 'params' });
          shouldLoadSearch(generator, { data: { some: 'data' } }, { searchQuery: 'foo', some: 'data', state: { some: 'state' } });
        });
      });
      describe('with an unsuccessful request', () => {
        it('gets params, posts to search endpoint, and captures error', () => {
          shouldGetParams(generator, searchPage, action, searchPage);
          shouldPostParams(generator, '/studies/search/foo/json', { any: 'params' });
          shouldBroadcastError(generator);
        });
      });
    });
    describe('if a search query is not passed in the action', () => {
      beforeEach(() => {
        action = { type: 'foo', state: { some: 'state' } };
        searchPage = { searchQuery: 'foo' };
        generator = sagas.doSearch(action);
        // search selector
        generator.next();
      });
      describe('if there is a search query stored in the state', () => {
        describe('with a successful request', () => {
          it('gets params, posts to the search endpoint, and brodcasts the search result action', () => {
            shouldGetParams(generator, searchPage, action, searchPage);
            shouldPostParams(generator, '/studies/search/foo/json', { any: 'params' });
            shouldLoadSearch(generator, { data: { some: 'data' } }, { searchQuery: 'foo', some: 'data', state: { some: 'state' } });
          });
        });
        describe('with an unsuccessful request', () => {
          it('gets params, posts to search endpoint, and captures error', () => {
            shouldGetParams(generator, searchPage, action, searchPage);
            shouldPostParams(generator, '/studies/search/foo/json', { any: 'params' });
            shouldBroadcastError(generator);
          });
        });
      });
      describe('without a search query stored in the state', () => {
        beforeEach(() => {
          action = { type: 'foo', state: { some: 'state' } };
          searchPage = { searchQuery: null };
          generator = sagas.doSearch(action);
          // search selector
          generator.next();
        });
        describe('with a successful request', () => {
          it('gets params, posts to the studies endpoint, and brodcasts the search result action', () => {
            shouldGetParams(generator, searchPage, action, searchPage);
            shouldPostParams(generator, '/studies/json', { any: 'params' });
            shouldLoadSearch(generator, { data: { some: 'data' } }, { searchQuery: undefined, some: 'data', state: { some: 'state' } });
          });
        });
        describe('with an unsuccessful request', () => {
          it('gets params, posts to studies endpoint, and captures error', () => {
            shouldGetParams(generator, searchPage, action, searchPage);
            shouldPostParams(generator, '/studies/json', { any: 'params' });
            shouldBroadcastError(generator);
          });
        });
      });
    });
  });
});
