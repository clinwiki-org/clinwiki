'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db, callback) {
  db.createTable('meta_fields',{
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    form_name: 'string',
    table_name: 'string',
    field_name: 'string',
    field_description : 'string',
    field_order: 'int',
    field_helper_text: 'string',
    field_data_type: 'string',
    field_input_type: 'string',
    field_action: 'string',
    field_action_values: 'string',
    role_permissions: 'string',
    created_at:{ type: 'timestamptz', notNull: true, defaultValue: new String('now()')},
    updated_at:{ type: 'timestamptz', notNull: true, defaultValue: new String('now()')},
  }, callback)};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
