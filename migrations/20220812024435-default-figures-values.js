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
  let figuresToInsert = [];
  figuresToInsert.push(db.insert('figures', ['name', 'description', 'cost', 'height', 'launch_status', 'release_date', 'quantity', 'listing_date', 'last_updated', 'image_url', 'thumbnail_url', 'blind_box', 'figure_type_id', 'collection_id', 'series_id'],
    ['figma Levi Ackerman', `I promise you, I will drive the Titans to extinction!" From the anime "Attack on Titan" comes a rerelease of the figma of mankind's strongest soldier, Levi! Using the smooth yet posable joints of figma, you can act out a variety of different scenes. Three expressions are included: His standard face, an expression with clenched teeth ready for combat and a cold-hearted expression perfect for Levi. His dual blades are included for combat scenes, along with his Vertical Maneuvering Equipment and effects parts. Special hand parts to display Levi holding the blades in his trademark reverse grip are also included. The hooks connected to a wire that shoot out from the equipment are also included, along with his Scouting Legion mantle. An articulated figma stand is included, which allows various poses to be taken.`,
      11600, 140, true, moment('2022-04-01').format(), 50, moment().format(), moment().format(), 'http://res.cloudinary.com/dqxvtdnej/image/upload/v1660146834/tiji1juzq14twdmghgek.jpg', 'http://res.cloudinary.com/dqxvtdnej/image/upload/v1660146834/tiji1juzq14twdmghgek.jpg', false, 1, 2, 5]));

  figuresToInsert.push(db.insert('figures', ['name', 'description', 'cost', 'height', 'launch_status', 'release_date', 'quantity', 'listing_date', 'last_updated', 'image_url', 'thumbnail_url', 'blind_box', 'figure_type_id', 'collection_id', 'series_id'],
    ['Variable Action Heroes: ONE PIECE - Zorojuro', `The Wano Country arc from ONE PIECE is joining the Variable Action Heroes series! The second to join the collection is Zorojuro, who stand approximately 180mm in height and features various points of articulation for all sorts of posing opportunities. The figure comes complete with the swords "Wado Ichimonji" and "Sandai Kitetsu", and of course also includes the sword he got during the Wano Country arc, "Enma", for a total of three swords which of course can all be wielded at once for some epic actions scenes! Four different face plates and a selection of hand parts are also included for even more display options. As always, the figure features realistic sculpting and intricate paintwork that fans will be proud to display in their collection!`,
      14300, 180, false, moment('2022-11-01').format(), 50, moment().format(), moment().format(), 'http://res.cloudinary.com/dqxvtdnej/image/upload/v1660890260/akkjkeulmaexnxiqonuv.jpg', 'https://res.cloudinary.com/dqxvtdnej/image/upload/c_fill,h_100,w_100/v1660890260/akkjkeulmaexnxiqonuv.jpg', false, 1, 3, 3]));

  figuresToInsert.push(db.insert('figures', ['name', 'description', 'cost', 'height', 'launch_status', 'release_date', 'quantity', 'listing_date', 'last_updated', 'image_url', 'thumbnail_url', 'blind_box', 'figure_type_id', 'collection_id', 'series_id'],
    ['Devil May Cry 5 ARTFX J - Dante', ` As seen in the stylish Devil May Cry 5 video game, the powerful demon hunter Dante is joining Kotobukiya’s ARTFX J line as a 1/8 scale statue!
    Dante has been sculpted as if he has jumped straight from the game, holding his signature blade “Rebellion” at the ready, with an aloof expression on his face. Each detail of the character’s appearance has been carefully recreated, from the leather texture on his coat and trousers to the metal buttons and fasteners on his costume.
    Rebellion is also faithfully recreated down to the intricate details of the skeleton on the hilt, which has a different design on the top and bottom; just one example of why this piece cannot be fully appreciated from one single angle. The blade of the sword is wreathed in delicately crafted flames that look like they will start flickering at any moment.`,
      28310, 240, true, moment('2019-09-01').format(), 10, moment().format(), moment().format(), 'http://res.cloudinary.com/dqxvtdnej/image/upload/v1660890657/k9tjs5qhqlyzbwzu18xk.webp', 'https://res.cloudinary.com/dqxvtdnej/image/upload/c_fill,h_100,w_100/v1660890657/k9tjs5qhqlyzbwzu18xk.jpg', false, 3, 4, 6]));

  figuresToInsert.push(db.insert('figures', ['name', 'description', 'cost', 'height', 'launch_status', 'release_date', 'quantity', 'listing_date', 'last_updated', 'image_url', 'thumbnail_url', 'blind_box', 'figure_type_id', 'collection_id', 'series_id'],
    ['Funko Pop! Pokemon - Squirtle', `From Pokemon, Squirtle, as a stylized POP vinyl from Funko!
    Stylized collectable stands 3 ¾ inches tall, perfect for any Pokemon fan!
    Collect and display all Pokemon pop! Vinyl's!`,
      1990, 160, true, moment('2019-09-13').format(), 5, moment().format(), moment().format(), 'http://res.cloudinary.com/dqxvtdnej/image/upload/v1661245175/vuwrxliw1wlxxsph27og.jpg', 'https://res.cloudinary.com/dqxvtdnej/image/upload/c_fill,h_100,w_100/v1661245175/vuwrxliw1wlxxsph27og.jpg', false, 1, 1, 2]));

  for (let each of figuresToInsert) {
    return each
  }
};

exports.down = function (db) {
  return null
};

exports._meta = {
  "version": 1
};
