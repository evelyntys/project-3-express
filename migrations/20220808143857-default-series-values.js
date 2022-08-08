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
  let defaultSeries = [];
  defaultSeries.push(db.insert('series', ['series_name'], ['marvel']));
  defaultSeries.push(db.insert('series', ['series_name'], ['pokemon']));
  defaultSeries.push(db.insert('series', ['series_name'], ['one piece']));
  defaultSeries.push(db.insert('series', ['series_name'], ['the office']));
  defaultSeries.push(db.insert('series', ['series_name'], ['attack on titan']));
  defaultSeries.push(db.insert('series', ['series_name'], ['devil may cry']));
  defaultSeries.push(db.insert('series', ['series_name'], ['labubu']));
  for (let each of defaultSeries){
    return each
  }
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
