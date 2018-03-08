import React from 'react';
import ReviewForm from 'components/ReviewForm';
import { mount } from 'enzyme';

import NewReviewSection from '../index';

describe('<NewReviewSection />', () => {
  const nctId = 'nct1234';
  const loggedIn = true;
  const submitReview = jest.fn();
  const section = mount(
    <NewReviewSection
      {...{
        nctId,
        loggedIn,
        submitReview,
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
  });
  it('should correctly submit the review based on the action passed to the section', () => {
    const reviewForm = section.find(ReviewForm).at(0);
    reviewForm.find('#submit-review').at(0).simulate('click');
    expect(submitReview).toBeCalled();
  });
});
