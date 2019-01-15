import React from 'react';
import { mount } from 'enzyme';
import RichTextEditor from 'react-rte-yt';
import ReactStars from 'react-stars';
import ReviewForm from '../index';

describe('<ReviewForm />', () => {
  const submitReview = jest.fn();
  const defaultProps = {
    submitReview,
    nctId: 'foo',
    loggedIn: true,
    review: '[foo](http://bar.com)',
    reviewId: 1,
    reviewIsLoading: false,
  };
  describe('by default', () => {
    const rendered = mount(<ReviewForm {...defaultProps} />);
    it('renders a review form in its default state', () => {
      expect(rendered.find(RichTextEditor).get(0).props.value._cache.markdown).toEqual(defaultProps.review); // eslint-disable-line no-underscore-dangle
    });
    it('shows an overall rating, safety, and efficacy', () => {
      expect(rendered.find(ReactStars).length).toEqual(3);
      const html = rendered.html();
      expect(html).toContain('Overall Rating');
      expect(html).toContain('Safety');
      expect(html).toContain('Efficacy');
    });
    it('supports submitting a review', () => {
      rendered.find('#submit-review').at(0).simulate('click');
      expect(submitReview).toBeCalledWith(
        'foo', '[foo](http://bar.com)', { 'Overall Rating': 0, Safety: 0, Efficacy: 0 }, 1);
    });
  });
  describe('with reviews', () => {
    const stars = {
      'Overall Rating': 5,
      Foo: 4,
      Bar: 3,
    };
    it('correctly renders the existing ratings', () => {
      const rendered = mount(<ReviewForm {...Object.assign({}, defaultProps, { stars })} />);
      expect(rendered.find('#Overall-Rating').find(ReactStars).get(0).props.value).toEqual(5);
      expect(rendered.find('#Foo').find(ReactStars).get(0).props.value).toEqual(4);
      expect(rendered.find('#Bar').find(ReactStars).get(0).props.value).toEqual(3);
    });
  });
});
