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
  return db.createTable('cart_items', {
    id: {
      type: 'int',
      unsigned: true,
      primaryKey: true,
      autoIncrement: true
    },
    quantity: {
      type: 'int',
      unsigned: true,
      notNull: true
    },
    customer_id: {
      type: 'int',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'cart_items_customer_fk',
        table: 'customers',
        mapping: 'id',
        rules: {
          onDelete: 'cascade',
          onUpdate: 'cascade'
        }
      }
    },
    figure_id: {
      type: 'int',
      notNull: true,
      unsigned: true,
      foreignKey: {
        name: 'cart_items_figure_fk',
        table: 'figures',
        mapping: 'id',
        rules: {
          onDelete: 'restrict',
          onUpdate: 'cascade'
        }
      }
    }
  });
};

exports.down = function(db) {
  return db.dropTable('cart_items')
};

exports._meta = {
  "version": 1
};
