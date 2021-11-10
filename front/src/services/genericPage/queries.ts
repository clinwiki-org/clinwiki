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

export const META_TABLE_QUERY = `
query MetaFieldsQuery($formName: String) {
  meta_fields(where: {form_name: {_eq: $formName}}) {
    table_name
    field_name
    field_description
    field_order
    field_helper_text
    field_data_type
    field_input_type
    field_action
    field_action_values
  }
}
`;
