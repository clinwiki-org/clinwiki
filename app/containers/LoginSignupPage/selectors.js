import { createSelector } from 'reselect';

/**
 * Direct selector to the loginSignupPage state domain
 */
const selectLoginSignupPageDomain = (state) => state.get('loginSignupPage');

/**
 * Other specific selectors
 */


/**
 * Default selector used by LoginSignupPage
 */

const makeSelectLoginSignupPage = () => createSelector(
  selectLoginSignupPageDomain,
  (substate) => substate.toJS()
);

export default makeSelectLoginSignupPage;
export {
  selectLoginSignupPageDomain,
};
