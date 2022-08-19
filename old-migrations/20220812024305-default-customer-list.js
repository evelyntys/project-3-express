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

exports.up = function(db) {
  let customers = [];
  customers.push(db.insert('customers', 
  ['username', 'email', 'password', 'first_name', 'last_name', 'contact_number'], 
  ['test', 'admin@email.com', getHashedPassword('admin123'), 'test', 'tester', '12345678']))
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
