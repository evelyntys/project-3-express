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
  let statuses = [];
  statuses.push(db.insert('order_statuses', ['order_status'], ['paid']));
  statuses.push(db.insert('order_statuses', ['order_status'], ['picked up by courier']));
  statuses.push(db.insert('order_statuses', ['order_status'], ['out for delivery']));
  statuses.push(db.insert('order_statuses', ['order_status'], ['delivered']));
  for (let each of statuses){
    return each
  }
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
