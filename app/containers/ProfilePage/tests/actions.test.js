import {
  itReturnsActionWithData,
  itReturnsActionWithErrors,
} from 'utils/testHelpers/sharedBehaviors';
import {
  defaultAction,
  submitProfile,
  populateColumnPickerAction,
  submitProfileErrorsAction,
} from '../actions';
import {
  DEFAULT_ACTION,
  SUBMIT_PROFILE_ACTION,
  SUBMIT_PROFILE_ERRORS_ACTION,
  POPULATE_COLUMN_PICKER_ACTION,
} from '../constants';

describe('ProfilePage actions', () => {
  describe('Default Action', () => {
    it('has a type of DEFAULT_ACTION', () => {
      const expected = {
        type: DEFAULT_ACTION,
      };
      expect(defaultAction()).toEqual(expected);
    });
  });
  describe('submitProfile', () => {
    itReturnsActionWithData(submitProfile, SUBMIT_PROFILE_ACTION, { foo: 'bar' });
  });
  describe('populateColumnPickerAction', () => {
    it('returns action with fields', () => {
      expect(populateColumnPickerAction(['foo', 'bar'])).toEqual({ type: POPULATE_COLUMN_PICKER_ACTION, fields: ['foo', 'bar'] });
    });
  });
  describe('submitProfileErrorsAction', () => {
    itReturnsActionWithErrors(submitProfileErrorsAction, SUBMIT_PROFILE_ERRORS_ACTION, { error: 'foo' });
  });
});
