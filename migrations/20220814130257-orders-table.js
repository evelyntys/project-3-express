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

const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Taipei');

exports.up = function (db) {
  return db.createTable('orders', {
    id: {
      type: 'int',
      unsigned: true,
      primaryKey: true,
      autoIncrement: true
    },
    ordered_date: {
      type: 'datetime',
      notNull: true
    },
    total_cost: {
      type: 'int',
      unsigned: true,
      notNull: true
    },
    remarks: {
      type: 'string',
      length: '500'
    },
    payment_reference: {
      type: 'string',
      varchar: '500',
      notNull: true
    },
    shipping_type_id: {
      type: 'smallint',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'orders_shipping_types_fk',
        table: 'shipping_types',
        mapping: 'id',
        rules: {
          onDelete: 'restrict',
          onUpdate: 'restrict'
        }
      }
    },
    order_status_id: {
      type: 'smallint',
      unsigned: true,
      notNull: true,
      defaultValue: 3,
      foreignKey: {
        name: 'orders_order_status_fk',
        table: 'order_statuses',
        mapping: 'id',
        rules: {
          onDelete: 'restrict',
          onUpdate: 'restrict'
        }
      }
    },
    customer_id: {
      type: 'int',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'orders_customers_fk',
        table: 'customers',
        mapping: 'id',
        rules: {
          onDelete: 'restrict',
          onUpdate: 'restrict'
        }
      }
    },
    block_street: {
      type: 'string',
      length: 100,
      notNull: true
    },
    unit: {
      type: 'string',
      length: 10,
      notNull: true,
    },
    postal: {
      type: 'string',
      length: 10,
      notNull: true
    },
    payment_method: {
      type: 'string',
      length: 20,
      notNull: true
    },
    receipt_url: {
      type: 'string',
      length: 500,
      notNull: true
    },
    updated_date: {
      type: 'datetime',
      notNull: true,
    },
    coupon_used: {
      type: 'string',
      length: 30
    }
  });
};

exports.down = function (db) {
  return db.dropTable('orders')
};

exports._meta = {
  "version": 1
};
