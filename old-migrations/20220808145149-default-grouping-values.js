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
  let groupToInsert = [];
  groupToInsert.push(db.insert('groupings', ['group_name'], ['movies-tv']));
  groupToInsert.push(db.insert('groupings', ['group_name'], ['animations-cartoon']));
  groupToInsert.push(db.insert('groupings', ['group_name'], ['video-games']));
  groupToInsert.push(db.insert('groupings', ['group_name'], ['original']));
  for (let each of groupToInsert){
    return each
  }
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
