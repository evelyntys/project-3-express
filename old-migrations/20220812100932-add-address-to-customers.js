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
  let cols = [];
  cols.push(db.addColumn('customers', 'street', {
    type: 'string',
    length: 100,
    notNull: true
  }));
  cols.push(db.addColumn('customers', 'unit', {
    type: 'string',
    length: 10,
    notNull: true
  })),
  cols.push(db.addColumn('customers', 'postal', {
    type: 'string',
    length: 10,
    notNull: true
  }))
  for (let each of cols){
    return each
  }
};

exports.down = function(db) {
  let cols = [];
  cols.push(db.removeColumn('customers', 'street'));
  cols.push(db.addColumn('customers', 'unit'));
  cols.push(db.addColumn('customers', 'postal'));
  for (let each of cols){
    return each
  }
};

exports._meta = {
  "version": 1
};
