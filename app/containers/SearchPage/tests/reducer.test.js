import { fromJS } from 'immutable';
import * as actions from '../actions';
import SearchPageReducer from '../reducer';

const otherState = fromJS({
  searchQuery: 'foo',
  recordsTotal: 2,
  data: [{ foo: 'bar' }, { baz: 'qux' }],
  loading: false,
  aggFilters: { stuff: ['this one'] },
  params: {
    page: 0,
    pageSize: 25,
    sorted: ['foo'],
  },
  aggs: { stuff: { buckets: ['this one', 'that one'] } },
});

describe('SearchPageReducer', () => {
  it('returns the initial state', () => {
    expect(SearchPageReducer(undefined, {})).toEqual(fromJS({
      searchQuery: null,
      recordsTotal: 0,
      data: [],
      loading: true,
      aggFilters: {},
      params: {
        page: 0,
        pageSize: 25,
        sorted: [],
      },
      aggs: {},
    }));
  });
  describe('search loading', () => {
    const newState = SearchPageReducer(otherState, actions.searchLoading());
    it('sets loading to true', () => {
      expect(newState.get('loading')).toBeTruthy();
    });
    it('empties the search result data', () => {
      expect(newState.get('data').size).toEqual(0);
    });
  });

  describe('search loaded', () => {
    const data = {
      searchQuery: 'hey',
      state: {
        page: 1,
        pageSize: 25,
        sorted: ['bar'],
      },
      recordsTotal: 50,
      data: [{ hey: 'there' }],
      aggs: { some: ['agg'] },
    };
    const newState = SearchPageReducer(otherState.set('loading', true), actions.searchLoaded(data));
    it('sets loading to false', () => {
      expect(newState.get('loading')).toBeFalsy();
    });
    it('sets the new search query', () => {
      expect(newState.get('searchQuery')).toEqual('hey');
    });
    it('updates the params from the data state', () => {
      expect(newState.get('params').toJS()).toEqual(data.state);
    });
    it('updates the result data', () => {
      expect(newState.get('data').toJS()).toEqual(data.data);
    });
    it('updates the aggs', () => {
      expect(newState.get('aggs').toJS()).toEqual(data.aggs);
    });
    it('updates the total records', () => {
      expect(newState.get('recordsTotal')).toEqual(50);
    });
    it('applies pagination logic', () => {
      expect(newState.get('pages')).toEqual(2);
    });
  });
  describe('agg viewed', () => {
    it('sets unviewed aggs to loading', () => {
      expect(SearchPageReducer(otherState, actions.aggViewed('stuff')).getIn(['aggs', 'stuff', 'loading'])).toBeTruthy();
    });
    it('keeps loaded aggs as not loading', () => {
      expect(
        SearchPageReducer(otherState.setIn(['aggs', 'stuff', 'loaded'], true), actions.aggViewed('stuff')).getIn(['aggs', 'stuff', 'loading'])
      ).toBeTruthy();
    });
  });
  describe('agg selection and removal', () => {
    let newState;
    it('creates empty agg filter nodes', () => {
      newState = SearchPageReducer(otherState, actions.aggSelected('foo', 'bar'));
      expect(newState.get('aggFilters').toJS().foo).toEqual(['bar']);
    });
    it('appends to existing agg filter arrays', () => {
      newState = SearchPageReducer(newState, actions.aggSelected('foo', 'baz'));
      expect(newState.get('aggFilters').toJS().foo).toEqual(['bar', 'baz']);
    });
    it('removes only the entry specified for a given agg filter', () => {
      newState = SearchPageReducer(newState, actions.aggRemoved('foo', 'bar'));
      expect(newState.get('aggFilters').toJS().foo).toEqual(['baz']);
    });
  });
  describe('agg loaded', () => {
    it('updates the agg we received as loaded', () => {
      const newState = SearchPageReducer(otherState, actions.aggLoaded('stuff', { aggs: { stuff: { buckets: ['whatever'] } } }));
      expect(newState.getIn(['aggs', 'stuff', 'loaded'])).toBeTruthy();
    });
  });
  describe('clear search data', () => {
    const newState = SearchPageReducer(otherState, actions.clearSearchData());
    it('clears total records', () => {
      expect(newState.get('recordsTotal')).toEqual(0);
    });
    it('keeps the search query', () => {
      expect(newState.get('searchQuery')).toEqual('foo');
    });
    it('sets the loading to true', () => {
      expect(newState.get('loading')).toBeTruthy();
    });
    it('keeps sorted', () => {
      expect(newState.getIn(['params', 'sorted']).toJS()).toEqual(['foo']);
    });
    it('keeps the aggs', () => {
      expect(newState.get('aggs')).toEqual(otherState.get('aggs'));
    });
    it('keeps the agg filters', () => {
      expect(newState.get('aggFilters')).toEqual(otherState.get('aggFilters'));
    });
  });
});
