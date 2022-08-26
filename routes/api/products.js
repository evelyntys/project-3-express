const express = require('express');
const router = express.Router();
const productDataLayer = require('../../dal/products');
const { Figure } = require('../../models');

router.get('/', async function (req, res) {
    let q = Figure.collection();
    let products = await productDataLayer.displayFigures(q);
    res.send(products);
});

router.get('/fields', async function (req, res) {
    let allFigureTypes = await productDataLayer.getAllFigureTypes();
    let allSeries = await productDataLayer.getAllSeries();
    let allCollections = await productDataLayer.getAllCollections();
    res.send({
        allFigureTypes,
        allSeries,
        allCollections
    })
})

router.get('/search', async function (req, res) {
    let q = Figure.collection();
    console.log(req.query);
    if (req.query.name) {
        q.where('name', 'like', '%' + req.query.name + '%')
    }
    if (req.query.min_cost) {
        q.where('cost', '>=', parseInt(req.query.min_cost) * 100)
    }
    if (req.query.max_cost) {
        q.where('cost', '<=', parseInt(req.query.max_cost) * 100)
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

router.get("/:figureId/view", async function (req, res) {
    let figureId = req.params.figureId;
    let productToShow = await productDataLayer.FigureByIdWithMediums(figureId);
    res.status(200);
    res.send({
        product: productToShow
    })
})

module.exports = router;