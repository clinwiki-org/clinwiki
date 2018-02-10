/*
 *
 * ProfilePage actions
 *
 */

import {
  DEFAULT_ACTION,
  SUBMIT_PROFILE_ACTION,
  POPULATE_COLUMN_PICKER_ACTION,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function submitProfile(data) {
  return {
    type: SUBMIT_PROFILE_ACTION,
    data,
  };
}

export function populateColumnPickerAction(fields) {
  return {
    type: POPULATE_COLUMN_PICKER_ACTION,
    fields,
  };
}
