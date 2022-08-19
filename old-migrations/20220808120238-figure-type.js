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
  return db.createTable('figure_types', {
    id: {
      type: 'smallint',
      unsigned: true,
      autoIncrement: true,
      primaryKey: true
    },
    figure_type: {
      type: 'string',
      length: '45',
      notNull: true

    }
  })
};

exports.down = function(db) {
  return db.dropTable('figure_types')
};

exports._meta = {
  "version": 1
};
