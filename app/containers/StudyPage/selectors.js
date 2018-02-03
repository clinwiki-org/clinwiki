import { createSelector } from 'reselect';
import { fromJS } from 'immutable';

/**
 * Direct selector to the StudyPage domain
 */
const selectStudyPageDomain = (state) => state.get('StudyPage');

/**
 * other selectors
 */


const makeSelectWikiMeta = () => createSelector(
  selectStudyPageDomain,
  (substate) => substate.getIn(['wiki', 'meta'], fromJS({})).toJS()
);

const makeSelectWiki = () => createSelector(
  selectStudyPageDomain,
  (substate) => substate.get('wiki', fromJS({})).toJS()
);

const makeSelectWikiOverride = () => createSelector(
  selectStudyPageDomain,
  (substate) => substate.get('wikiOverride', true)
);


/**
 * Default selector for studypage
 */
const makeSelectStudyPage = () => createSelector(
  selectStudyPageDomain,
  (substate) => substate.toJS()
);


export default makeSelectStudyPage;
export {
  selectStudyPageDomain,
  makeSelectWikiMeta,
  makeSelectWiki,
  makeSelectWikiOverride,
};
