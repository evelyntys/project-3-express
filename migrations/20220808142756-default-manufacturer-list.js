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
  let manufacturersToInsert = [];
  manufacturersToInsert.push(db.insert('manufacturers', ['manufacturer_name'], ['funko inc']));
  manufacturersToInsert.push(db.insert('manufacturers', ['manufacturer_name'], ['popmart']));
  manufacturersToInsert.push(db.insert('manufacturers', ['manufacturer_name'], ['good smile company']));
  manufacturersToInsert.push(db.insert('manufacturers', ['manufacturer_name'], ['bandai']));
  manufacturersToInsert.push(db.insert('manufacturers', ['manufacturer_name'], ['aniplex']));
  for (let each of manufacturersToInsert){
    return each
  }
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
