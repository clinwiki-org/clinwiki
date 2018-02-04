import { createSelector } from 'reselect';

/**
 * Direct selector to the reviewSection state domain
 */
const selectReviewSectionDomain = (state) => state.get('reviewSection');

/**
 * Other specific selectors
 */


/**
 * Default selector used by ReviewSection
 */

const makeSelectReviewSection = () => createSelector(
  selectReviewSectionDomain,
  (substate) => substate.toJS()
);

export default makeSelectReviewSection;
export {
  selectReviewSectionDomain,
};
