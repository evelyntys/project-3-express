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
    let allManufacturers = await productDataLayer.getAllManufacturers();
    res.send({
        allFigureTypes,
        allSeries,
        allCollections,
        allManufacturers
    })
})

router.get('/search', async function (req, res) {
    let q = Figure.collection();
    let queryTerm = "like";
    if (process.env.DB_DRIVER == "postgres") {
        queryTerm = "ilike"
    };

    if (req.query.name) {
        q.where('name', queryTerm, '%' + req.query.name + '%')
    };

    if (req.query.min_cost) {
        q.where('cost', '>=', parseInt(req.query.min_cost) * 100)
    };

    if (req.query.max_cost) {
        q.where('cost', '<=', parseInt(req.query.max_cost) * 100)
    };

    if (req.query.collection_id && req.query.collection_id != 0) {
        q.where('collection_id', req.query.collection_id)
    };

    if (req.query.min_height) {
        q.where('height', '>=', parseInt(req.query.min_height) * 10)
    };

    if (req.query.max_height) {
        q.where('height', '<=', parseInt(req.query.max_height) * 10)
    };

    if (parseInt(req.query.blind_box) >= 0) {
        q.where('blind_box', parseInt(req.query.blind_box))
    };

    if (parseInt(req.query.launch_status) >= 0) {
        q.where('launch_status', parseInt(req.query.launch_status))
    };

    if (req.query.figure_type_id) {
        q.where('figure_type_id', 'in', req.query.figure_type_id)
    };


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

router.get("/series/:seriesId", async function (req, res) {
    let seriesId = parseInt(req.params.seriesId);
    let relatedProducts = await productDataLayer.getProductsBySeries(seriesId);
    res.status(200);
    res.send({
        relatedProducts
    })
});

router.get("/newlylisted", async function (req, res) {
    let products = await productDataLayer.getNewlyListed();
    res.status(200);
    res.send({
        products
    })
})

module.exports = router;