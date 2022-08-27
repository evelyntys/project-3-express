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
  return db.createTable('figures', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true,
      unsigned: true
    },
    name: {
      type: 'string',
      length: 255,
      notNull: true
    },
    description: {
      type: 'string',
      length: 1000,
      notNull: true
    },
    cost: {
      type: 'int',
      unsigned: true,
      notNull: true
    },
    height: {
      type: 'int',
      unsigned: true,
      notNull: true
    },
    launch_status: {
      type: 'boolean',
      notNull: true
    },
    release_date: {
      type: 'date',
      notNull: true
    },
    quantity: {
      type: 'int',
      unsigned: true,
      notNull: true
    },
    listing_date: {
      type: 'datetime',
      notNull: true
    },
    last_updated: {
      type: 'datetime',
      notNull: true
    },
    image_url: {
      type: 'string',
      length: '500',
    },
    thumbnail_url: {
      type: 'string',
      length: '500'
    },
    blind_box: {
      type: 'boolean',
      notNull: true
    }
  })
};

exports.down = function (db) {
  return db.dropTable('figures');
};

exports._meta = {
  "version": 1
};
