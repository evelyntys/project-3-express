'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  return db.createTable('shipping_types', {
    id: {
      type: 'int',
      unsigned: true,
      primaryKey: true,
      autoIncrement: true
    },
    shipping_type: {
      type: 'string',
      length: 20,
      notNull: true,
    },
    amount: {
      type: 'smallint',
      unsigned: true,
      notNull: true
    },
    min_day: {
      type: 'smallint',
      unsigned: true,
      notNull: true
    },
    max_day: {
      type: 'smallint',
      unsigned: true,
      notNull: true
    }
  });
}

exports.down = function (db) {
  return db.dropTable('shipping_types')
};

exports._meta = {
  "version": 1
};
