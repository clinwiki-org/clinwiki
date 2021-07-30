export const INSERT_CROWD_KEY_VALUE_ID = `
mutation InsertCrowdKeyValueId($crowd_key:String!, $crowd_key_value_id_association:String!, $crowd_value: String!, $user_id: bigint!, $verified: Boolean, $approved: Boolean) {
  insert_crowd_key_value_ids(objects: {crowd_key: $crowd_key, crowd_key_value_id_association: $crowd_key_value_id_association, crowd_value: $crowd_value, user_id: $user_id, verified: $verified, approved: $approved}) {
    returning {
      id
      created_at
      crowd_key
      crowd_key_value_id_association
      crowd_value
    }
  }
}
`;
export const DELETE_CROWD_KEY_VALUE_ID = `
mutation DeleteCrowdKeyValueId($crowd_key: String!, $crowd_key_value_id_association: String!, $crowd_value: String!) {
  delete_crowd_key_value_ids(where: {crowd_key: {_eq: $crowd_key}, crowd_key_value_id_association: {_eq: $crowd_key_value_id_association}, crowd_value: {_eq: $crowd_value}}) {
    returning {
      id
      user_id
    }
  }
}
`;

export const UPDATE_CROWD_KEY_VALUE_ID = `
mutation updateCrowdKeyValueId($crowdKeyValueIdPK: Int!, $crowdValue: String!) {
  update_crowd_key_value_ids_by_pk(pk_columns: {id: $crowdKeyValueIdPK}, _set: {crowd_value: $crowdValue}) {
    id
    updated_at
    crowd_key
    crowd_key_value_id_association
    crowd_value
  }
}
`;

export const UPSERT_CROWD_KEY_VALUE_ID = `
mutation InsertCrowdKeyValueId($crowd_key:String!, $crowd_key_value_id_association:String!, $crowd_value: String!, $user_id: bigint!, $verified: Boolean, $approved: Boolean) {
  insert_crowd_key_value_ids(objects: {crowd_key: $crowd_key, crowd_key_value_id_association: $crowd_key_value_id_association, crowd_value: $crowd_value, user_id: $user_id, verified: $verified, approved: $approved}, 
    on_conflict: {
constraint: crowd_key_value_ids_pkey, #//crowd_value
update_columns: [crowd_value]
}
    ) {
    returning {
      crowd_key
      crowd_key_value_id_association
      crowd_value
    }
  }
}

`;
