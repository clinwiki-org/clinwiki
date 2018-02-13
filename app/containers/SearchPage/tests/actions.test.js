import {
  itReturnsActionWithData,
  itReturnsActionWithErrors,
  itReturnsAction,
} from 'utils/testHelpers/sharedBehaviors';
import * as actions from '../actions';
import * as constants from '../constants';

describe('SearchPage actions', () => {
  describe('searchChanged', () => {
    it('returns search changed with query', () => {
      expect(actions.searchChanged('foo')).toEqual({ type: constants.SEARCH_CHANGED, searchQuery: 'foo' });
    });
  });
  describe('searchLoaded', () => {
    itReturnsActionWithData(actions.searchLoaded, constants.SEARCH_LOADED, { foo: 'bar' });
  });
  describe('searchLoadedError', () => {
    itReturnsActionWithErrors(actions.searchLoadedError, constants.SEARCH_LOADED_ERROR, { error: 'something' });
  });
  describe('clearSearchData', () => {
    itReturnsAction(actions.clearSearchData, constants.CLEAR_SEARCH_DATA);
  });
  describe('aggViewed', () => {
    it('returns action of type AGG_VIEWED with agg', () => {
      expect(actions.aggViewed('agg')).toEqual({ type: constants.AGG_VIEWED, agg: 'agg' });
    });
  });
  describe('aggLoaded', () => {
    it('returns action of type AGG_LOADED with agg and data', () => {
      expect(actions.aggLoaded('agg', { some: 'data' })).toEqual({ type: constants.AGG_LOADED, agg: 'agg', data: { some: 'data' } });
    });
  });
  describe('aggLoadedError', () => {
    it('returns action of type AGG_LAODED_ERROR with agg and error', () => {
      expect(actions.aggLoadedError('agg', { some: 'error' })).toEqual({ type: constants.AGG_LOADED_ERROR, agg: 'agg', error: { some: 'error' } });
    });
  });
  describe('dataFetched', () => {
    const state = { foo: 'bar' };
    it('sets the search query as null by default', () => {
      expect(actions.dataFetched(state)).toEqual({ type: constants.DATA_FETCHED, state, searchQuery: null });
    });
    it('passes the search query on from a match object', () => {
      expect(actions.dataFetched(state, { params: { searchQuery: 'foo' } })).toEqual({ type: constants.DATA_FETCHED, state, searchQuery: 'foo' });
    });
  });
  describe('searchLoading', () => {
    itReturnsAction(actions.searchLoading, constants.SEARCH_LOADING);
  });
  describe('aggSelected', () => {
    it('returns the action of type AGG_SELECTED with the agg and the value', () => {
      expect(actions.aggSelected('foo', 'bar')).toEqual({ type: constants.AGG_SELECTED, agg: 'foo', value: 'bar' });
    });
  });
  describe('aggRemoved', () => {
    it('returns the action of type AGG_REMOVED with the agg and the value', () => {
      expect(actions.aggRemoved('foo', 'bar')).toEqual({ type: constants.AGG_REMOVED, agg: 'foo', value: 'bar' });
    });
  });
});
