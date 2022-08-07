'use strict';

var dbm;
var type;
var seed;
const moment = require('moment');

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
  return db.insert(
    'figures', 
    ['name', 'cost', 'height', 'launch_status', 'release_date', 'quantity', 'listing_date'], 
    ['figma levi ackerman', 116, 140, true, '2022-04-1', 10, moment().format()]
  )
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
