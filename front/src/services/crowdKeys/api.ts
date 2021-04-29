import * as mutate from './mutations';
import * as query from './queries';
import { getHasuraClinwikiURL, callHasuraClinwiki } from 'utils/graphqlUtil';

// This is a temporary measure to support different enpoints during the backend migration to NodeJS
// Once that is complete, all endpoint URLs should be pulled from a common constant

const HASURA_CW = getHasuraClinwikiURL();

export const insertCrowdKeyValueId = (
  crowdKeyValueId,
  crowdValue,
  crowdKey,
  userId,
  verified,
  approved) => {
  // console.log('mutation = ', mutate.UPDATE_CROWD_KEY_VALUE_ID);
  // console.log('input = ',     crowdKeyValueId,crowdValue  crowdKey);
  return callHasuraClinwiki(HASURA_CW, mutate.INSERT_CROWD_KEY_VALUE_ID, {
    crowd_key_value_id_association: crowdKeyValueId,
    crowd_value: crowdValue,
    crowd_key: crowdKey,
    user_id: userId,
    verified,
    approved
  });
  //{ input: { id: input.id, name: input.name}});
};
export const deleteCrowdKeyValueId = (
  crowdKeyValueId,
  crowdValue,
  crowdKey,
  ) => {
  // console.log('mutation = ', mutate.UPDATE_CROWD_KEY_VALUE_ID);
  // console.log('input = ',     crowdKeyValueId,crowdValue  crowdKey);
  return callHasuraClinwiki(HASURA_CW, mutate.DELETE_CROWD_KEY_VALUE_ID, {
    crowd_key_value_id_association: crowdKeyValueId,
    crowd_value: crowdValue,
    crowd_key: crowdKey,
  });
  //{ input: { id: input.id, name: input.name}});
};