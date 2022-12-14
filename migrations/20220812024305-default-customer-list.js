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

const crypto = require('crypto');
const getHashedPassword = (password) => {
  const sha256 = crypto.createHash('sha256');
  const hash = sha256.update(password).digest('base64');
  return hash;
}

const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Taipei');

exports.up = function(db) {
  let customers = [];
  customers.push(db.insert('customers', 
  ['username', 'email', 'password', 'first_name', 'last_name', 'contact_number', 'block_street', 'unit', 'postal', 'created_date', 'updated_date'], 
  ['customer', 'customer@email.com', getHashedPassword('customer123'), 'first', 'customer', '12345678', 'blk 123 street 9', '#03-24', '412412', moment().format(), moment().format()]))
  for (let each of customers){
    return each
  }
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
