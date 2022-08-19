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
  return db.createTable('collection_series', {
    id: {
      type: 'int',
      unsigned: true,
      primaryKey: true,
      autoIncrement: true
    },
    collection_id: {
      type: 'int',
      notNull: true,
      unsigned: true,
      foreignKey: {
        name: 'collections_series_collection_fk',
        table: 'collections',
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
        name: 'series_collections_series_fk',
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
  return db.dropTable('collection_series')
};

exports._meta = {
  "version": 1
};
