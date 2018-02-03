/*
 *
 * WikiSection actions
 *
 */

import {
  DEFAULT_ACTION,
  WIKI_ACTION,
  WIKI_SUBMIT_ACTION,
  WIKI_VIEWED,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export const wikiAction = (data) => ({
  type: WIKI_ACTION,
  data,
});

export const submitWiki = (nctId, wikiText) => ({
  type: WIKI_SUBMIT_ACTION,
  nctId,
  wikiText,
});

export const wikiViewed = (nctId) => ({
  type: WIKI_VIEWED,
  nctId,
});
