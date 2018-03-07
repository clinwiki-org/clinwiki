import React from 'react';
import { mount } from 'enzyme';

import AggDropdown from 'components/AggDropdown';
import Aggs from '../index';

describe('<Aggs />', () => {
  it('should return null if there are no aggs provided', () => {
    const onAggViewed = jest.fn();
    const onAggRemoved = jest.fn();
    const onAggSelected = jest.fn();
    const rendered = mount(
      <Aggs
        aggFilters={{ }}
        aggs={null}
        onAggRemoved={onAggRemoved}
        onAggSelected={onAggSelected}
        onAggViewed={onAggViewed}
      />
    );
    expect(rendered.children().length).toEqual(0);
  });
  it('should generate an Agg per agg provided', () => {
    const onAggViewed = jest.fn();
    const onAggRemoved = jest.fn();
    const onAggSelected = jest.fn();
    const rendered = mount(
      <Aggs
        aggFilters={{ average_rating: ['1', '2', '3'], tags: [] }}
        aggs={{
          average_rating: { buckets: ['1', '2', '3', '4', '5'] },
          tags: { buckets: ['e', 'f', 'g', 'h'] },
        }}
        onAggRemoved={onAggRemoved}
        onAggSelected={onAggSelected}
        onAggViewed={onAggViewed}
      />
    );
    const dropdowns = rendered.find(AggDropdown);
    expect(dropdowns.length).toEqual(2);
    expect(dropdowns.get(0).props).toMatchObject({
      agg: 'average_rating',
      selectedKeys: ['1', '2', '3'],
      data: { buckets: ['1', '2', '3', '4', '5'] },
    });
    expect(dropdowns.get(1).props).toMatchObject({
      agg: 'tags',
      selectedKeys: [],
      data: { buckets: ['e', 'f', 'g', 'h'] },
    });
  });
});
