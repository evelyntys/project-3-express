const express = require('express');
const router = express.Router();
const moment = require('moment');
const { createFigureForm, bootstrapField } = require('../forms');
const { Figure, FigureType, Series } = require('../models')

router.get('/', async function (req, res) {
    let figures = await Figure.collection().fetch({
        withRelated: ['figure_type', 'series']
    });
    figures = figures.toJSON();
    for (let each of figures) {
        each.release_date = moment(each.release_date).format('L')
        each.listing_date = moment(each.listing_date).format('L, LTS')
    }
    res.render('products/index', {
        figures
    });
})

router.get('/create', async function (req, res) {
    let allFigureTypes = await FigureType.fetchAll().map(figureType => {
        return [figureType.get('id'), figureType.get('figure_type')]
    });
    let allSeries = await Series.fetchAll().map(series => {
        return [series.get('id'), series.get('series_name')]
    });
    const figureForm = createFigureForm(allFigureTypes, allSeries).toHTML(bootstrapField);
    res.render('products/create', {
        figureForm
    })
})

router.post('/create', async function (req, res) {
    let allFigureTypes = await FigureType.fetchAll().map(figureType => {
        return [figureType.get('id'), figureType.get('figure_type')]
    });
    let allSeries = await Series.fetchAll().map(series => {
        return [series.get('id'), series.get('series_name')]
    });
    const figureForm = createFigureForm(allFigureTypes, allSeries);
    figureForm.handle(req, {
        success: async function (form) {
            const figure = new Figure();
            figure.set(form.data);
            figure.set('listing_date', moment().format());
            await figure.save();
            res.redirect('/products')
        },
        error: async function (form) {
            res.render('products/create', {
                figureForm: form.toHTML(bootstrapField)
            })
        }
    })

})

router.get('/:figure_id/update', async function (req, res) {
    const figureID = req.params.figure_id;
    let figure = await Figure.where({
        id: figureID
    }).fetch({
        require: true
    })
    let allFigureTypes = await FigureType.fetchAll().map(figureType => {
        return [figureType.get('id'), figureType.get('figure_type')]
    });
    let allSeries = await Series.fetchAll().map(series => {
        return [series.get('id'), series.get('series_name')]
    });
    const figureForm = createFigureForm(allFigureTypes, allSeries);
    figureForm.fields.name.value = figure.get('name');
    figureForm.fields.cost.value = figure.get('cost');
    figureForm.fields.height.value = figure.get('height');
    figureForm.fields.launch_status.value = figure.get('launch_status');
    figureForm.fields.release_date.value = moment(figure.get('release_date')).format('YYYY-MM-DD');
    figureForm.fields.quantity.value = figure.get('quantity');
    figureForm.fields.figure_type_id.value = figure.get('figure_type_id');
    figureForm.fields.series_id.value = figure.get('series_id')

    res.render('products/update', {
        form: figureForm.toHTML(bootstrapField),
        figure: figure.toJSON()
    })
})

router.post('/:figure_id/update', async function (req, res) {
    let figureID = req.params.figure_id;
    let figure = await Figure.where({
        id: figureID
    }).fetch({
        require: true
    });
    let allFigureTypes = await FigureType.fetchAll().map(figureType => {
        return [figureType.get('id'), figureType.get('figure_type')]
    });
    let allSeries = await Series.fetchAll().map(series => {
        return [series.get('id'), series.get('series_name')]
    })
    const figureForm = createFigureForm(allFigureTypes, allSeries);
    figureForm.handle(req, {
        success: async function (form) {
            figure.set(form.data);
            figure.set('listing_date', moment().format());
            await figure.save();
            res.redirect('/products');
        },
        error: async function (form) {
            res.render('products/update', {
                form: form.toHTML(bootstrapField)
            })
        }
    })
})

// router.get('/:figure_id/delete', async function(req,res){

// })

router.post('/:figure_id/delete', async function (req, res) {
    let figureID = req.params.figure_id;
    let figure = await Figure.where({
        id: figureID
    }).fetch({
        require: true
    })
    await figure.destroy();
    res.redirect('/products')
})

module.exports = router;