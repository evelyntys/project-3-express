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
  collectionsToInsert.push(db.insert('collections', ['collection_name', 'manufacturer_id'], ['funko pop', 1]));
  collectionsToInsert.push(db.insert('collections', ['collection_name', 'manufacturer_id'], ['figma', 3]));
  collectionsToInsert.push(db.insert('collections', ['collection_name', 'manufacturer_id'], ['variable action heroes', 7]));
  collectionsToInsert.push(db.insert('collections', ['collection_name', 'manufacturer_id'], ['artfx j', 6]));
  collectionsToInsert.push(db.insert('collections', ['collection_name', 'manufacturer_id'], ['labubu x spongebob', 2]));
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
