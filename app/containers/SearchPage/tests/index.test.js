import React from 'react';
import { mount } from 'enzyme';
import ReactTable from 'react-table';
import { IntlProvider } from 'react-intl';
import { createMemoryHistory } from 'history';
import LoadingPane from 'components/LoadingPane';
import Aggs from 'components/Aggs';
import { SearchPage } from '../index';

describe('<SearchPage />', () => {
  const history = createMemoryHistory('/');
  const match = { isExact: false, params: {}, path: '/', url: '/' };

  describe('without a session checked', () => {
    const rendered = mount(
      <SearchPage
        {...{
          actions: {},
          match,
          history,
          AuthHeader: { sessionChecked: false },
        }}
      />
    );
    it('shows a loading pane', () => {
      expect(rendered.contains(<LoadingPane />)).toBe(true);
    });
    it('does not show a table', () => {
      expect(rendered.contains(ReactTable)).toBe(false);
    });
  });
  describe('with data', () => {
    const dataFetched = jest.fn();
    const aggViewed = jest.fn();
    const aggSelected = jest.fn();
    const aggRemoved = jest.fn();
    const aggs = { foo: {}, bar: {} };
    const aggFilters = { foo: ['a'] };
    const data = [];
    const rendered = mount(
      <IntlProvider locale="en">
        <SearchPage
          {...{
            actions: { dataFetched, aggViewed, aggSelected, aggRemoved },
            match,
            history,
            AuthHeader: { sessionChecked: true },
            SearchPage: {
              data,
              recordsTotal: 100,
              pages: 10,
              aggs,
              searchQuery: 'baz',
              loading: true,
              aggFilters,
              params: { pageSize: 10 },
            },
          }}
        />
      </IntlProvider>
    );
    it('delegates aggs to the aggs component', () => {
      const foundAggs = rendered.find(Aggs);
      expect(foundAggs.length).toEqual(1);
      const agg = foundAggs.get(0);
      expect(agg.props.aggFilters).toEqual(aggFilters);
      expect(agg.props.aggs).toEqual(aggs);
      expect(agg.props.onAggViewed).toEqual(aggViewed);
      expect(agg.props.onAggRemoved).toEqual(aggRemoved);
      expect(agg.props.onAggSelected).toEqual(aggSelected);
    });
    it('delegates search results to a ReactTable component', () => {
      const foundTable = rendered.find(ReactTable);
      expect(foundTable.length).toEqual(1);
      const table = foundTable.get(0);
      expect(table.props.data).toEqual(data);
      expect(table.props.loading).toEqual(true);
      expect(table.props.pages).toEqual(10);
      expect(table.props.defaultPageSize).toEqual(10);
    });
  });
});
