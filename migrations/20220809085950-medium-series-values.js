'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  let seriesMediums = [];
  seriesMediums.push(db.insert('mediums_series', ['medium_id', 'series_id'], [1, 1]));
  seriesMediums.push(db.insert('mediums_series', ['medium_id', 'series_id'], [2, 1]));
  seriesMediums.push(db.insert('mediums_series', ['medium_id', 'series_id'], [2, 2]));
  seriesMediums.push(db.insert('mediums_series', ['medium_id', 'series_id'], [3, 2]));
  seriesMediums.push(db.insert('mediums_series', ['medium_id', 'series_id'], [2, 3]));
  seriesMediums.push(db.insert('mediums_series', ['medium_id', 'series_id'], [1, 4]));
  seriesMediums.push(db.insert('mediums_series', ['medium_id', 'series_id'], [2, 5]));
  seriesMediums.push(db.insert('mediums_series', ['medium_id', 'series_id'], [2, 6]));
  seriesMediums.push(db.insert('mediums_series', ['medium_id', 'series_id'], [3, 6]));
  seriesMediums.push(db.insert('mediums_series', ['medium_id', 'series_id'], [4, 7]));
  for (let each of seriesMediums) {
    return each
  }
}
  exports.down = function (db) {
    return null
  };

  exports._meta = {
    "version": 1
  };
