import { createSelector } from 'reselect';

/**
 * Direct selector to the wikiSection state domain
 */
const selectWikiSectionDomain = (state) => state.get('wikiSection');

/**
 * Other specific selectors
 */


/**
 * Default selector used by WikiSection
 */

const makeSelectWikiSection = () => createSelector(
  selectWikiSectionDomain,
  (substate) => substate.toJS()
);

export default makeSelectWikiSection;
export {
  selectWikiSectionDomain,
};
