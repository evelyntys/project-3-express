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
  return db.addColumn('collections', 'manufacturer_id', {
    type: 'int',
    unsigned: true,
    notNull: true,
    defaultValue: 1,
    foreignKey: {
      name: 'collection_manufacturer_fk',
      table: 'manufacturers',
      rules: {
        onDelete: 'cascade',
        onCascade: 'restrict'
      },
      mapping: 'id',
      defaultValue: 1
    }
    
  })
};

exports.down = function(db) {
  return db.dropColumn('manufacturer_id');
};

exports._meta = {
  "version": 1
};
