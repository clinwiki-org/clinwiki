import React from 'react';
import ReviewForm from 'components/ReviewForm';
import { mount } from 'enzyme';

import EditReviewSection from '../index';

describe('<EditReviewSection />', () => {
  const nctId = 'nct1234';
  const loggedIn = true;
  const updateReview = jest.fn();
  const review = {
    text: 'check [this](http://foo.com) out!',
    id: 9,
    stars: {
      'Overall Rating': 5,
      Safety: 4,
      Efficacy: 3,
    },
  };
  const section = mount(
    <EditReviewSection
      {...{
        nctId,
        loggedIn,
        updateReview,
        review,
      }}
    />
  );
  it('should render a review edit form', () => {
    expect(section.contains(ReviewForm)).toBe(true);
  });
  it('should correctly pass props to the review edit form', () => {
    const reviewForm = section.find(ReviewForm).get(0);
    const props = reviewForm.props;
    expect(props.nctId).toEqual(nctId);
    expect(props.loggedIn).toEqual(loggedIn);
    expect(props.stars).toEqual(review.stars);
    expect(props.review).toEqual(review.text);
    expect(props.reviewId).toEqual(review.id);
  });
  it('should correctly submit the review based on the action passed to the section', () => {
    const reviewForm = section.find(ReviewForm).at(0);
    reviewForm.find('#submit-review').at(0).simulate('click');
    expect(updateReview).toBeCalledWith('nct1234', review.text, review.stars, review.id);
  });
});
