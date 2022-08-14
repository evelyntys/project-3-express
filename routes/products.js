const express = require('express');
const router = express.Router();
const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Taipei');
const { createFigureForm, bootstrapField, createSearchForm } = require('../forms');
const { Figure, FigureType, Series, Collection, Manufacturer, Medium } = require('../models');
const dataLayer = require('../dal/products');

router.get('/', async function (req, res) {
    let allFigureTypes = await dataLayer.getAllFigureTypes();
    allFigureTypes.unshift([0, '---select a figure type---']);
    let allSeries = await dataLayer.getAllSeries();
    allSeries.unshift([0, '---select a series---']);
    let allCollections = await dataLayer.getAllCollections();
    allCollections.unshift([0, '---select a collection---']);
    let q = Figure.collection();
    let searchForm = createSearchForm(allFigureTypes, allSeries, allCollections);
    searchForm.handle(req, {
        empty: async function (form) {
            let figures = await dataLayer.displayFigures(q);
            res.render('products/index', {
                figures: figures,
                form: form.toHTML(bootstrapField)
            });
        },
        error: async function (form) {
            let figures = await dataLayer.displayFigures(q);
            res.render('products/index', {
                figures: figures,
                form: form.toHTML(bootstrapField)
            });
        },
        success: async function (form) {
            if (form.data.name) {
                q.where('name', 'like', '%' + form.data.name + '%')
            }
            if (form.data.min_cost) {
                q.where('cost', '>=', form.data.min_cost)
            }
            if (form.data.max_cost) {
                q.where('cost', '<=', form.data.max_cost)
            }

            if (form.data.figure_type_id && form.data.figure_type_id != 0) {
                q.where('figure_type_id', form.data.figure_type_id)
            }
            if (form.data.series_id && form.data.series_id != 0) {
                q.where('series_id', form.data.series_id)
            }
            if (form.data.collection_id && form.data.collection_id != 0) {
                q.where('collection_id', form.data.collection_id)
            };
            if (form.data.last_updated) {
                let date = new Date(form.data.last_updated);
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
            let figures = await dataLayer.displayFigures(q);
            res.render('products/index', {
                figures: figures,
                form: form.toHTML(bootstrapField)
            });
        }
    })
})

router.get('/create', async function (req, res) {
    let [allFigureTypes, allSeries, allCollections, allMediums] = await dataLayer.getValuesForForm();
    const figureForm = createFigureForm(allFigureTypes, allSeries, allCollections, allMediums);
    let localMedium = await dataLayer.getRelatedMediumsForCheckbox();
    res.render('products/create', {
        figureForm: figureForm.toHTML(bootstrapField),
        series_mediums: JSON.stringify(localMedium),
        cloudinaryName: process.env.CLOUDINARY_NAME,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
    })
});

router.post('/create', async function (req, res) {
    let [allFigureTypes, allSeries, allCollections, allMediums] = await dataLayer.getValuesForForm();
    let localMedium = await dataLayer.getRelatedMediumsForCheckbox();
    const figureForm = createFigureForm(allFigureTypes, allSeries, allCollections, allMediums);
    figureForm.handle(req, {
        success: async function (form) {
            const figure = new Figure();
            let { medium_id, series_id, collection_id, cost, ...figureData } = form.data;
            if (series_id == 0) {
                series_id = await dataLayer.addNewSeries(req.body['new-series']);
            }
            if (collection_id == 0) {
                collection_id = await dataLayer.addNewCollection(req.body['new-manufacturer'], req.body['new-collection']);
            }
            figure.set(figureData);
            figure.set('series_id', series_id);
            figure.set('collection_id', collection_id);
            figure.set('listing_date', moment().format());
            figure.set('cost', cost * 100);
            await figure.save();
            const series = await dataLayer.getSeriesById(series_id);
            if (medium_id) {
                await series.mediums().attach(medium_id.split(','));
            };
            req.flash('success_messages', `new product ${figureData.name} has been added successfully`);
            res.redirect('/products');
        },
        error: async function (form) {
            req.flash('error_messages', 'please check the fields again')
            res.render('products/create', {
                figureForm: form.toHTML(bootstrapField),
                series_mediums: JSON.stringify(localMedium)
            })
        },
        empty: function (form) {
            res.render('/products/create', {
                figureForm: form.toHTML(bootstrapField),
                series_mediums: JSON.stringify(localMedium)
            }
            )
        }
    })
})

router.get('/:figure_id/update', async function (req, res) {
    const figureID = req.params.figure_id;
    let figure = await dataLayer.getFigureById(figureID);
    let seriesId = figure.toJSON().series_id;
    let associatedSeries = await dataLayer.getSeriesById(seriesId);
    figure.series = associatedSeries.toJSON();
    let [allFigureTypes, allSeries, allCollections, allMediums] = await dataLayer.getValuesForForm();
    let localMedium = await dataLayer.getRelatedMediumsForCheckbox();
    const figureForm = createFigureForm(allFigureTypes, allSeries, allCollections, allMediums);
    figureForm.fields.name.value = figure.get('name');
    figureForm.fields.cost.value = (figure.get('cost') / 100).toFixed(2);
    figureForm.fields.height.value = figure.get('height');
    figureForm.fields.launch_status.value = figure.get('launch_status');
    figureForm.fields.release_date.value = moment(figure.get('release_date')).format('YYYY-MM-DD');
    figureForm.fields.quantity.value = figure.get('quantity');
    figureForm.fields.figure_type_id.value = figure.get('figure_type_id');
    figureForm.fields.series_id.value = figure.get('series_id');
    figureForm.fields.collection_id.value = figure.get('collection_id');
    figureForm.fields.image_url.value = figure.get('image_url');
    let selectedMediums = await associatedSeries.related('mediums').pluck('id');
    figureForm.fields.medium_id.value = selectedMediums;

    res.render('products/update', {
        form: figureForm.toHTML(bootstrapField),
        figure: figure.toJSON(),
        series_mediums: JSON.stringify(localMedium),
        cloudinaryName: process.env.CLOUDINARY_NAME,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
    })
})

router.post('/:figure_id/update', async function (req, res) {
    let figureID = req.params.figure_id;
    let figure = await dataLayer.getFigureById(figureID);
    let [allFigureTypes, allSeries, allCollections, allMediums] = await dataLayer.getValuesForForm();
    let localMedium = await dataLayer.getRelatedMediumsForCheckbox();
    const figureForm = createFigureForm(allFigureTypes, allSeries, allCollections, allMediums);
    figureForm.handle(req, {
        success: async function (form) {
            let { medium_id, series_id, collection_id, cost, ...figureData } = form.data;
            if (series_id == 0) {
                series_id = await dataLayer.addNewSeries(req.body['new-series']);
            }
            if (collection_id == 0) {
                collection_id = await dataLayer.addNewCollection(req.body['new-manufacturer'], req.body['new-collection']);
            }
            figure.set(figureData);
            figure.set('series_id', series_id);
            figure.set('collection_id', collection_id);
            figure.set('listing_date', moment().format());
            figure.set('cost', cost * 100);
            await figure.save();
            const series = await dataLayer.getSeriesById(series_id);
            let selectedMediums = medium_id.split(',').map(id => parseInt(id));
            let existingMediumIds = await series.related('mediums').pluck('id');
            let toRemove = existingMediumIds.filter(id => !selectedMediums.includes(id));
            await series.mediums().detach(toRemove);
            await series.mediums().attach(selectedMediums);
            req.flash('success_messages', `${figureData.name} has been updated successfully`);
            res.redirect('/products');
        },
        error: async function (form) {
            res.render('products/update', {
                form: form.toHTML(bootstrapField),
                series_mediums: JSON.stringify(localMedium)
            })
        },
        empty: function (form) {
            res.render('/products/update', {
                figureForm: form.toHTML(bootstrapField),
                series_mediums: JSON.stringify(localMedium)
            }
            )
        }
    })
})

router.post('/:figure_id/delete', async function (req, res) {
    let figureID = req.params.figure_id;
    let figure = await dataLayer.getFigureById(figureID);
    await figure.destroy();
    req.flash('success_messages', `product ${figure.name} has been deleted successfully`);
    res.redirect('/products')
})

module.exports = router;