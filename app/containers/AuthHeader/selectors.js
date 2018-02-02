import { createSelector } from 'reselect';

/**
 * Direct selector to the authHeader state domain
 */
const selectAuthHeaderDomain = (state) => state.get('authHeader');

/**
 * Other specific selectors
 */


/**
 * Default selector used by AuthHeader
 */

const makeSelectAuthHeader = () => createSelector(
  selectAuthHeaderDomain,
  (substate) => substate.toJS()
);

export default makeSelectAuthHeader;
export {
  selectAuthHeaderDomain,
};
