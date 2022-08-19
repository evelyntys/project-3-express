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
};

const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Taipei');

exports.up = function(db) {
  return db.insert('admins', ['username', 'email', 'password', 'first_name', 'last_name', 'created_date', 'updated_date'], 
  ['admin', 'admin@email.com', getHashedPassword('admin123'), 'figuya', 'admin', moment().format(), moment().format()]);
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
