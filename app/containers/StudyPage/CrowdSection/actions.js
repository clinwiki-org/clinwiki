/*
 *
 * CrowdSection actions
 *
 */

import {
  DEFAULT_ACTION,
  ANNOTATION_DELETE,
  ANNOTATION_CREATE,
  ANNOTATION_UPDATE,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export const createAnnotation = (nctId, key, value) => ({
  type: ANNOTATION_CREATE,
  nctId,
  key,
  value,
});

export const updateAnnotation = (nctId, key, value) => ({
  type: ANNOTATION_UPDATE,
  nctId,
  key,
  value,
});

export const deleteAnnotation = (nctId, key) => ({
  type: ANNOTATION_DELETE,
  nctId,
  key,
});
