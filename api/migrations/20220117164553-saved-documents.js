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
  db.createTable('saved_documents',{
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    user_id: 'int',
    name_label: 'string',
    is_subscribed: 'boolean',
    document_id: 'string',
    url: 'string',
    created_at:{ type: 'timestamptz', notNull: true, defaultValue: new String('now()')},
    updated_at:{ type: 'timestamptz', notNull: true, defaultValue: new String('now()')},
  }, callback)
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
