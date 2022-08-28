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
  let mediumToInsert = [];
  mediumToInsert.push(db.insert('mediums', ['media_medium'], ['movies & tv']));
  mediumToInsert.push(db.insert('mediums', ['media_medium'], ['animations & cartoons']));
  mediumToInsert.push(db.insert('mediums', ['media_medium'], ['video games']));
  mediumToInsert.push(db.insert('mediums', ['media_medium'], ['original']));
  for (let each of mediumToInsert){
    return each
  }
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
