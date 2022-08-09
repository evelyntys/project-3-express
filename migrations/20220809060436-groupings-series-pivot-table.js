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
  return db.createTable('groupings_series', {
    id: {
      type: 'smallint',
      primaryKey: true,
      autoIncrement: true
    },
    grouping_id: {
      type: 'smallint',
      notNull: true,
      unsigned: true,
      foreignKey: {
        name: 'groupings_series_grouping_fk',
        table: 'groupings',
        rules: {
          onDelete: 'cascade',
          onUpdate: 'restrict'
        },
        mapping: 'id'
      }
    },
    series_id: {
      type: 'int',
      notNull: true,
      unsigned: true,
      foreignKey: {
        name: 'groupings_series_series_fk',
        table: 'series',
        rules: {
          onDelete: 'cascade',
          onUpdate: 'restrict'
        },
        mapping: 'id'
      }
    }
  })
};

exports.down = function(db) {
  return db.dropTable('groupings_series');
};

exports._meta = {
  "version": 1
};
