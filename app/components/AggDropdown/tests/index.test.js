import React from 'react';
import { mount } from 'enzyme';
import { BeatLoader } from 'react-spinners';
import { MenuItem, Label } from 'react-bootstrap';
import AggDropdown from '../index';

describe('<AggDropdown />', () => {
  const onAggRemoved = jest.fn();
  const onAggViewed = jest.fn();
  const onAggSelected = jest.fn();
  let data;
  let selectedKeys;
  const rendered = () => mount(
    <AggDropdown
      {...{
        onAggRemoved,
        onAggSelected,
        onAggViewed,
        data,
        selectedKeys,
        agg: 'foo',
      }}
    />);
  describe('if no buckets are available', () => {
    beforeEach(() => {
      data = {};
    });
    it('renders a loader', () => {
      expect(rendered().find(BeatLoader).length).toEqual(1);
    });
  });
  describe('with buckets available', () => {
    beforeEach(() => {
      data = {
        buckets: {
          a: {
            key: 'a',
            doc_count: 10,
          },
          b: {
            key: 'b',
            doc_count: 100,
          },
        },
      };
    });
    it('renders a menu item per bucket', () => {
      expect(rendered().find(MenuItem).length).toEqual(2);
    });
    it('shows the count of the menu item', () => {
      expect(rendered().find(MenuItem).get(0).props.children.join('')).toEqual('a (10)');
      expect(rendered().find(MenuItem).get(1).props.children.join('')).toEqual('b (100)');
    });
    it('triggers on aggselected if clicking the menuitem', () => {
      // simlulating click doesn't work
      rendered().find(MenuItem).get(0).props.onSelect();
      expect(onAggSelected).toBeCalled();
    });
    describe('if the aggs are loading right now', () => {
      beforeEach(() => { data.loading = true; });
      it('renders a loader', () => {
        expect(rendered().find(BeatLoader).length).toEqual(1);
      });
    });
    describe('if an agg has been selected', () => {
      beforeEach(() => { selectedKeys = ['a']; });
      it('should render a selected agg', () => {
        expect(rendered().find('.selected-aggs').length).toEqual(1);
        expect(rendered().find(Label).get(0).props.children[0]).toEqual('a');
      });
      it('should trigger onAggRemoved when clicking the remove icon', () => {
        // lazy man's trigger click
        rendered().find('.remove').first().simulate('click');
        expect(onAggRemoved).toBeCalled();
      });
    });
  });
});
