export const SCHEMA_TOKENS_QUERY = `
query SchemaTokensQuery($id: Int) {
    mail_merge_schemas {
      id
      name
      pk_value
      pk_type
      end_point
      options
      parentQuery
      created_at
      updated_at
      
    }
  }
  `