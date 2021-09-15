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

exports.up = function(db,callback) {
  db.createTable('page_view_logs', {
    id: { type: 'int', primaryKey: true, autoIncrement: true},
    user_id: 'int',
    url: 'string',
    created_at:{ type: 'timestamptz', notNull: true, defaultValue: new String('now()')},
    updated_at:{ type: 'timestamptz', notNull: true, defaultValue: new String('now()')},
  },callback);
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
