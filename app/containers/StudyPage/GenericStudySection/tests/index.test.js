import React from 'react';
import { shallow } from 'enzyme';

import GenericStudySection from '../index';

describe('<GenericStudySection />', () => {
  const data = [
    { label: 'foo', value: 'bar' },
    { label: 'baz', value: 'qux' },
  ];
  const rendered = shallow(
    <GenericStudySection data={data} />
  );
  it('maps data with labels and values to a generic table view', () => {
    const rows = rendered.find('.generic-item-row');
    expect(rows.length).toEqual(2);
    expect(rows.at(0).find('.generic-item-row-key').text()).toContain('foo');
    expect(rows.at(0).find('.generic-item-row-value').text()).toContain('bar');
    expect(rows.at(1).find('.generic-item-row-key').text()).toContain('baz');
    expect(rows.at(1).find('.generic-item-row-value').text()).toContain('qux');
  });
});
