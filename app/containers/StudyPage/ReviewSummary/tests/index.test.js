import React from 'react';
import { mount } from 'enzyme';
import ReactStars from 'react-stars';
import { BeatLoader } from 'react-spinners';
import ReviewSummary from '../index';

describe('<ReviewSummary />', () => {
  describe('without data', () => {
    const rendered = mount(<ReviewSummary />);
    it('renders a beatloader, not stars', () => {
      expect(rendered.find(BeatLoader).length).toBeGreaterThan(0);
      expect(rendered.find(ReactStars).length).toEqual(0);
    });
  });
  describe('with data', () => {
    const rendered = mount(
      <ReviewSummary
        average_rating={'4.5'}
        reviews_length={10}
      />
    );
    it('should display the number of reviews', () => {
      expect(rendered.text()).toContain('10 Reviews');
    });
    it('should show the average rating as stars', () => {
      expect(rendered.find(ReactStars).get(0).props.value).toEqual(4.5);
    });
  });
});
