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
  let collectionsToInsert = [];
  collectionsToInsert.push(db.insert('collections', ['collection_name'], ['funko pop']));
  collectionsToInsert.push(db.insert('collections', ['collection_name'], ['figma']));
  collectionsToInsert.push(db.insert('collections', ['collection_name'], ['variable action heroes']));
  collectionsToInsert.push(db.insert('collections', ['collection_name'], ['artfx j']));
  collectionsToInsert.push(db.insert('collections', ['collection_name'], ['labubu x spongebob']));
  for (let each of collectionsToInsert){
    return each
  }
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
