
import {
  defaultAction,
  createAnnotation,
  updateAnnotation,
  deleteAnnotation,
} from '../actions';
import {
  DEFAULT_ACTION,
  ANNOTATION_DELETE,
  ANNOTATION_CREATE,
  ANNOTATION_UPDATE,
} from '../constants';

describe('CrowdSection actions', () => {
  const key = 'foo';
  const value = 'bar';
  const nctId = 'nct123';
  describe('Default Action', () => {
    it('has a type of DEFAULT_ACTION', () => {
      const expected = {
        type: DEFAULT_ACTION,
      };
      expect(defaultAction()).toEqual(expected);
    });
  });
  describe('create annotation', () => {
    it('transmits nctId, key, and value to the correct type', () => {
      expect(createAnnotation(nctId, key, value)).toEqual({
        type: ANNOTATION_CREATE,
        key,
        value,
        nctId,
      });
    });
  });
  describe('update annotation', () => {
    it('transmits nctId, key, and value to the correct type', () => {
      expect(updateAnnotation(nctId, key, value)).toEqual({
        type: ANNOTATION_UPDATE,
        key,
        value,
        nctId,
      });
    });
  });
  describe('delete annotation', () => {
    it('transmits nctId and key to the correct type', () => {
      expect(deleteAnnotation(nctId, key)).toEqual({
        type: ANNOTATION_DELETE,
        key,
        nctId,
      });
    });
  });
});
