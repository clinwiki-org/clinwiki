/**
 * Test  sagas
 */

/* eslint-disable redux-saga/yield-effects */
import { call, put } from 'redux-saga/effects';
import client from 'utils/client';
import { wikiUrl } from '../../saga';
import { RELOAD_STUDY_ACTION } from '../../constants';
import { ANNOTATION_CREATE, ANNOTATION_DELETE } from '../constants';
import { postAnnotation, deleteAnnotation } from '../saga';

describe('crowdsection sagas', () => {
  describe('postAnnotation', () => {
    const action = {
      type: ANNOTATION_CREATE,
      key: 'foo',
      value: 'bar',
      nctId: 'nct123',
    };
    const generator = postAnnotation(action);
    it('posts the annotation to the server', () => {
      expect(generator.next().value).toEqual(call(client.post, wikiUrl(action), { add_meta: action }));
    });
    it('reloads the study afterwards', () => {
      expect(generator.next().value).toEqual(put({ type: RELOAD_STUDY_ACTION, nctId: action.nctId }));
    });
  });
  describe('deleteAnnotation', () => {
    const action = {
      type: ANNOTATION_DELETE,
      key: 'foo',
      nctId: 'nct123',
    };
    const generator = deleteAnnotation(action);
    it('deletes the annotation from the server', () => {
      expect(generator.next().value).toEqual(call(client.post, wikiUrl(action), { delete_meta: { key: 'foo' } }));
    });
    it('reloads the study afterwards', () => {
      expect(generator.next().value).toEqual(put({ type: RELOAD_STUDY_ACTION, nctId: action.nctId }));
    });
  });
});
