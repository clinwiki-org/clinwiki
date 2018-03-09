import { fromJS } from 'immutable';
import { createSelector } from 'reselect';

/**
 * Direct selector to the SearchPage state domain
 */
const selectSearchPageDomain = (state) => state.get('SearchPage', fromJS({}));

/**
 * Other specific selectors
 */


/**
 * Default selector used by SearchPage
 */

const makeSelectSearchPage = () => createSelector(
  selectSearchPageDomain,
  (substate) => substate.toJS()
);

export default makeSelectSearchPage;
export {
  selectSearchPageDomain,
};
