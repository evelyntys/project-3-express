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
  let columns = [];
  columns.push(db.addColumn('figures', 'blind_box', {
    type: 'boolean',
    notNull: true,
    defaultValue: false
  }));
  columns.push(db.addColumn('figures', 'description', {
    type: 'string',
    length: 5000
  }));
  for (let each of columns){
    return each
  }
};

exports.down = function(db) {
  let columns = [];
  columns.push(db.removeColumn('figures', 'blind_box'));
  columns.push(db.removeColumn('figures', 'description'));  
  for (let each of columns){
    return each
  }
};

exports._meta = {
  "version": 1
};
