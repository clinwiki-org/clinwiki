import { createSelector } from 'reselect';

/**
 * Direct selector to the crowdSection state domain
 */
const selectCrowdSectionDomain = (state) => state.get('crowdSection');

/**
 * Other specific selectors
 */


/**
 * Default selector used by CrowdSection
 */

const makeSelectCrowdSection = () => createSelector(
  selectCrowdSectionDomain,
  (substate) => substate.toJS()
);

export default makeSelectCrowdSection;
export {
  selectCrowdSectionDomain,
};
