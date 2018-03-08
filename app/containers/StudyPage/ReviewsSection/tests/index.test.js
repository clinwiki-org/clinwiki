import React from 'react';
import { createMemoryHistory } from 'history';
import { mount } from 'enzyme';
import { Label } from 'react-bootstrap';
import ReactStars from 'react-stars';
import ReviewsSection from '../index';

describe('<ReviewsSection />', () => {
  const nctId = 'nct12345';
  const deleteReview = jest.fn();
  const AuthHeader = { user: { id: 1, loggedIn: true } };
  const getRendered = (otherProps) => {
    const props = {
      nctId,
      deleteReview,
      AuthHeader,
    };
    return mount(
      <ReviewsSection {...Object.assign({}, props, otherProps)} />
    );
  };
  const itLetsYouWriteReviews = (rendered, history) => {
    it('lets you write reviews', () => {
      const priorHistory = history.length;
      const writeReview = rendered.find('#write-review');
      expect(writeReview.length).toBeGreaterThan(0);
      writeReview.at(0).simulate('click');
      expect(history.length).toBeGreaterThan(priorHistory);
      expect(history.location.pathname).toEqual('/study/nct12345/reviews/new');
    });
  };
  describe('with no reviews', () => {
    const history = createMemoryHistory('/study/nct12345/reviews');
    const rendered = getRendered({ history });
    it('shows "no reviews!"', () => {
      expect(rendered.text()).toContain('No Reviews!');
    });
    it('does not list any reviews', () => {
      expect(rendered.find('#reviews-table').length).toEqual(0);
    });
    itLetsYouWriteReviews(rendered, history);
  });
  describe('with reviews', () => {
    const history = createMemoryHistory('/study/nct12345/reviews');
    const reviews = [
      {
        user: { id: 1, first_name: 'foo', last_name: 'barson' },
        review: {
          id: 1,
          nct_id: nctId,
          stars: {
            'Overall Rating': 5,
            Safety: 4,
            Efficacy: 3,
            Foo: 2,
          },
          text_html: '<a href="http://foo.com">Awesome!</a>',
          created_at: new Date(),
        },
      },
      {
        user: { id: 2, email: 'foo@bar.com' },
        review: {
          id: 2,
          nct_id: nctId,
          stars: {},
          text_html: 'I refuse to rate!',
          created_at: new Date(),
        },
      },
    ];
    const rendered = getRendered({ reviews, history });
    itLetsYouWriteReviews(rendered, history);
    const rows = rendered.find('tr.review-row');
    it('renders a table row per review', () => {
      expect(rows.length).toEqual(2);
    });
    it('displays the name of the user that wrote the review, backing off to email', () => {
      expect(rows.at(0).find('.name-of-user').first().text()).toEqual('foo b');
      expect(rows.at(1).find('.name-of-user').first().text()).toEqual('foo@bar.com');
    });
    it('shows the correct number of stars for each review', () => {
      expect(rows.at(0).find('.star-rating-Overall-Rating').at(0).find(Label).first().text()).toEqual('Overall Rating');
      expect(rows.at(0).find('.star-rating-Overall-Rating').at(0).find(ReactStars).get(0).props.value).toEqual(5);
      expect(rows.at(0).find('.star-rating-Safety').at(0).find(Label).first().text()).toEqual('Safety');
      expect(rows.at(0).find('.star-rating-Safety').at(0).find(ReactStars).get(0).props.value).toEqual(4);
      expect(rows.at(0).find('.star-rating-Efficacy').at(0).find(Label).first().text()).toEqual('Efficacy');
      expect(rows.at(0).find('.star-rating-Efficacy').at(0).find(ReactStars).get(0).props.value).toEqual(3);
      expect(rows.at(1).find('.star-rating').length).toEqual(0);
    });
    it('displays the html of the review', () => {
      expect(rows.at(0).find('.review-html').html()).toEqual(`<div class="review-html">${reviews[0].review.text_html}</div>`);
      expect(rows.at(1).find('.review-html').html()).toEqual(`<div class="review-html">${reviews[1].review.text_html}</div>`);
    });
    it('allows users to edit their review', () => {
      const editReviewButtons = rows.at(0).find('.edit-review-button');
      expect(editReviewButtons.length).toBeGreaterThan(0);
      const priorHistory = history.length;
      editReviewButtons.first().simulate('click');
      expect(history.length).toBeGreaterThan(priorHistory);
      expect(history.location.pathname).toEqual('/study/nct12345/review/1/edit');
    });
    it('allows users to delete their review', () => {
      const deleteReviewButtons = rows.at(0).find('.delete-review-button');
      expect(deleteReviewButtons.length).toBeGreaterThan(0);
      deleteReviewButtons.first().simulate('click');
      expect(deleteReview).toBeCalledWith(nctId, 1);
    });
    it('prevents users from deleting or editing other users reviews', () => {
      expect(rows.at(1).find('.edit-review-button').length).toEqual(0);
      expect(rows.at(1).find('.delete-review-button').length).toEqual(0);
    });
  });
});
