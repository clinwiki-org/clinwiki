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
  db.createTable('crowd_key_value_ids_audit', {
    id: { type: 'int', primaryKey: true, autoIncrement: true},
    user_id: 'int',
    ckvi_id: 'int',
    crowd_key: 'string',
    crowd_value: 'string',
    crowd_key_value_id_association: 'string',
    verified: 'boolean',
    approved: 'boolean',
    evidence:{type: 'string', notNull: false},
    indexed: 'boolean',
    ckvi_created_at:'timestamptz',
    ckvi_updated_at: 'timestamptz',
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
