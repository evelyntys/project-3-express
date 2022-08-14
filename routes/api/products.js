const express = require('express');
const router = express.Router();
const productDataLayer = require('../../dal/products');
const { Figure } = require('../../models');

router.get('/', async function(req, res){
    let q = Figure.collection();
    let products = await productDataLayer.displayFigures(q);
    res.send(products);
});

router.get('/search', async function(req, res){
    let q = Figure.collection();
    if (req.query.name) {
        q.where('name', 'like', '%' + req.query.name + '%')
    }
    if (req.query.min_cost) {
        q.where('cost', '>=', req.query.min_cost)
    }
    if (req.query.max_cost) {
        q.where('cost', '<=', req.query.max_cost)
    }

    if (req.query.figure_type_id && req.query.figure_type_id != 0) {
        q.where('figure_type_id', req.query.figure_type_id)
    }
    if (req.query.series_id && req.query.series_id != 0) {
        q.where('series_id', req.query.series_id)
    }
    if (req.query.collection_id && req.query.collection_id != 0) {
        q.where('collection_id', req.query.collection_id)
    };
    if (req.query.last_updated) {
        let date = new Date(req.query.last_updated);
        let day = 60 * 60 * 24 * 1000 - 1000;
        let endDate = new Date(date.getTime() + day);
        console.log(endDate)
        date = moment(date).format();
        endDate = moment(endDate).format();
        q.query(function (dateQuery) {
            dateQuery.whereBetween('listing_date', [date, endDate]);
        });
        q.orderBy('listing_date', 'DESC');
    }
    let figures = await productDataLayer.displayFigures(q);
    res.send(figures);
});

module.exports = router;