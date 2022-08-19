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
  return db.createTable('mediums_series', {
    id: {
      type: 'smallint',
      primaryKey: true,
      autoIncrement: true
    },
    medium_id: {
      type: 'smallint',
      notNull: true,
      unsigned: true,
      foreignKey: {
        name: 'mediums_series_medium_fk',
        table: 'mediums',
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
        name: 'mediums_series_series_fk',
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
  return db.dropTable('mediums_series');
};

exports._meta = {
  "version": 1
};
