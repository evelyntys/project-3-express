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
  return db.createTable('customers', {
    id: {
      type: 'int',
      unsigned: true,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: 'string',
      length: 50,
      notNull: true
    },
    email: {
      type: 'string',
      length: 320,
      notNull: true
    },
    password: {
      type: 'string',
      length: 255,
      notNull: true
    },
    first_name: {
      type: 'string',
      length: 50,
      notNull: true
    },
    last_name: {
      type: 'string',
      length: 50,
      notNull: true
    },
    contact_number: {
      type: 'string',
      length: 15,
      notNull: true
    },
    block_street: {
      type: 'string',
      length: 255,
      notNull: true
    },
    unit: {
      type: 'string',
      length: 10
    },
    postal: {
      type: 'string',
      length: 10,
      notNull: true
    },
    created_date: {
      type: 'datetime',
      notNull: true
    },
    updated_date: {
      type: 'datetime',
      notNull: true
    }
    
  })
};

exports.down = function(db) {
  return db.dropTable('customers')
};

exports._meta = {
  "version": 1
};
