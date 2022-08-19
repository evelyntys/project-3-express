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

const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Taipei');

exports.up = function(db) {
  let figuresToInsert = [];
  figuresToInsert.push(db.insert('figures',['name', 'description', 'cost', 'height', 'launch_status', 'release_date', 'quantity', 'listing_date', 'last_updated', 'image_url', 'thumbnail_url', 'blind_box', 'figure_type_id', 'collection_id', 'series_id'],
  ['figma Levi Ackerman', `I promise you, I will drive the Titans to extinction!" From the anime "Attack on Titan" comes a rerelease of the figma of mankind's strongest soldier, Levi! Using the smooth yet posable joints of figma, you can act out a variety of different scenes. Three expressions are included: His standard face, an expression with clenched teeth ready for combat and a cold-hearted expression perfect for Levi. His dual blades are included for combat scenes, along with his Vertical Maneuvering Equipment and effects parts. Special hand parts to display Levi holding the blades in his trademark reverse grip are also included. The hooks connected to a wire that shoot out from the equipment are also included, along with his Scouting Legion mantle. An articulated figma stand is included, which allows various poses to be taken.`,
11600, 140, true, moment('2022-04-01').format(), 10, moment().format(), moment().format(), 'http://res.cloudinary.com/dqxvtdnej/image/upload/v1660146834/tiji1juzq14twdmghgek.jpg', 'http://res.cloudinary.com/dqxvtdnej/image/upload/v1660146834/tiji1juzq14twdmghgek.jpg', false, 1, 2, 5 ]));
for (let each of figuresToInsert){
  return each
}
};

exports.down = function(db) {
  return null
};

exports._meta = {
  "version": 1
};
