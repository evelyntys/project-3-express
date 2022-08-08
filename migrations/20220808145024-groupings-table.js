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

exports.up = function(db) {
  return db.createTable('groupings', {
    id: {
      type: 'smallint',
      primaryKey: true,
      unsigned: true,
      autoIncrement: true
    },
    group_name: {
      type: 'string',
      length: '50',
      notNull: true
    }
  })
};

exports.down = function(db) {
  return db.dropTable('groupings');
};

exports._meta = {
  "version": 1
};
