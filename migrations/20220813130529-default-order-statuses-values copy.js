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
  let types = [];
  types.push(db.insert('shipping_types', 
  ['shipping_type', 'amount', 'min_day', 'max_day'], 
  ['standard', 500, 5, 7]));
  types.push(db.insert('shipping_types', 
  ['shipping_type', 'amount', 'min_day', 'max_day'], 
  ['express', 1000, 1, 2]));
  for (let each of types){
    return each
  }
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
