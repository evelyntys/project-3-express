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

const moment = require('moment');

exports.up = function(db) {
  return db.addColumn('orders', 'updated_date', {
    type: 'datetime',
    notNull: true,
    defaultValue: moment().format()
  });
};

exports.down = function(db) {
  return db.removeColumn('orders', 'updated_date');
};

exports._meta = {
  "version": 1
};
