import { createSelector } from 'reselect';

/**
 * Direct selector to the loginSignup state domain
 */
const selectLoginSignupDomain = () => (state) => state.get('loginSignup');

/**
 * Other specific selectors
 */


/**
 * Default selector used by LoginSignup
 */

const makeSelectLoginSignup = () => createSelector(
  selectLoginSignupDomain(),
  (substate) => (substate && substate.toJS()) || {}
);

export default makeSelectLoginSignup;
export {
  selectLoginSignupDomain,
};
