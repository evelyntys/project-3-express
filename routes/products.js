const express = require('express');
const router = express.Router();
const moment = require('moment');
const { Figure } = require('../models')

router.get('/', async function (req, res) {
    let figures = await Figure.collection().fetch();
    figures = figures.toJSON();
    for (let each of figures){
        each.release_date = moment(each.release_date).format('L')
        each.listing_date = moment(each.listing_date).format('L, LTS')
    }
    res.render('products/index', {
        figures
    });
})

module.exports = router;