const express = require('express');
const router = express.Router();
const moment = require('moment');
const { createFigureForm, bootstrapField, createSearchForm } = require('../forms');
const { Figure, FigureType, Series, Collection, Manufacturer, Medium } = require('../models')

router.get('/', async function (req, res) {
    // let figures = await Figure.collection().fetch({
    //     withRelated: ['figure_type', 'series', 'collection']
    // });
    // figures = figures.toJSON();
    // for (let each of figures) {
    //     each.release_date = moment(each.release_date).format('L');
    //     each.listing_date = moment(each.listing_date).format('L, LTS');
    //     let manufacturer = await Manufacturer.where({
    //         id: each.collection.manufacturer_id
    //     }).fetch({
    //         require: true,
    //     })
    //     manufacturer = manufacturer.toJSON();
    //     each.manufacturer = manufacturer;
    //     let series = await Series.where({
    //         id: each.series_id
    //     }).fetch({
    //         withRelated: ['mediums']
    //     })
    //     series = series.toJSON();
    //     each.series = series;
    // }
    let q = Figure.collection();
    let searchForm = createSearchForm();
    searchForm.handle(req, {
        empty: async function(form){
            let figures = await q.fetch({
                withRelated: ['figure_type', 'series', 'collection']
            });
            figures = figures.toJSON();
            for (let each of figures) {
                    each.release_date = moment(each.release_date).format('L');
                    each.listing_date = moment(each.listing_date).format('L, LTS');
                    let manufacturer = await Manufacturer.where({
                        id: each.collection.manufacturer_id
                    }).fetch({
                        require: true,
                    })
                    manufacturer = manufacturer.toJSON();
                    each.manufacturer = manufacturer;
                    let series = await Series.where({
                        id: each.series_id
                    }).fetch({
                        withRelated: ['mediums']
                    })
                    series = series.toJSON();
                    each.series = series;
                }
            res.render('products/index', {
                figures: figures,
                form: form.toHTML(bootstrapField)
            });
        },
        error: async function(form){
            let figures = await q.fetch({
                withRelated: ['figure_type', 'series', 'collection']
            });
            figures = figures.toJSON();
            for (let each of figures) {
                    each.release_date = moment(each.release_date).format('L');
                    each.listing_date = moment(each.listing_date).format('L, LTS');
                    let manufacturer = await Manufacturer.where({
                        id: each.collection.manufacturer_id
                    }).fetch({
                        require: true,
                    })
                    manufacturer = manufacturer.toJSON();
                    each.manufacturer = manufacturer;
                    let series = await Series.where({
                        id: each.series_id
                    }).fetch({
                        withRelated: ['mediums']
                    })
                    series = series.toJSON();
                    each.series = series;
                }
            res.render('products/index', {
                figures: figures,
                form: form.toHTML(bootstrapField)
            });
        },
        success: async function(form){
            let figures = await q.fetch({
                withRelated: ['figure_type', 'series', 'collection']
            });
            figures = figures.toJSON();
            for (let each of figures) {
                    each.release_date = moment(each.release_date).format('L');
                    each.listing_date = moment(each.listing_date).format('L, LTS');
                    let manufacturer = await Manufacturer.where({
                        id: each.collection.manufacturer_id
                    }).fetch({
                        require: true,
                    })
                    manufacturer = manufacturer.toJSON();
                    each.manufacturer = manufacturer;
                    let series = await Series.where({
                        id: each.series_id
                    }).fetch({
                        withRelated: ['mediums']
                    })
                    series = series.toJSON();
                    each.series = series;
                }
            res.render('products/index', {
                figures: figures,
                form: form.toHTML(bootstrapField)
            });
        }
    })
})

router.get('/create', async function (req, res) {
    let allFigureTypes = await FigureType.fetchAll().map(figureType => {
        return [figureType.get('id'), figureType.get('figure_type')]
    });
    let allSeries = await Series.fetchAll().map(series => {
        return [series.get('id'), series.get('series_name')]
    });
    allSeries = [...allSeries, [0, 'add new']];
    let allCollections = await Collection.fetchAll().map(collection => {
        return [collection.get('id'), collection.get('collection_name')]
    });
    allCollections = [...allCollections, [0, 'add new']];
    let allMediums = await Medium.fetchAll().map(medium => {
        return [medium.get('id'), medium.get('media_medium')]
    });
    const figureForm = createFigureForm(allFigureTypes, allSeries, allCollections, allMediums);
    let series = await Series.fetchAll({
        withRelated: ['mediums']
    });
    let seriesID = await series.pluck('id');
    let x = 0;
    let localMedium = [];
    for (let each of series) {
        let associatedMediums = await each.related('mediums').pluck('id');
        localMedium.push({
            [seriesID[x]]: associatedMediums
        });
        x = x + 1;
    }
    res.render('products/create', {
        figureForm: figureForm.toHTML(bootstrapField),
        series_mediums: JSON.stringify(localMedium),
        cloudinaryName: process.env.CLOUDINARY_NAME,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
    })
});

router.post('/create', async function (req, res) {
    let allFigureTypes = await FigureType.fetchAll().map(figureType => {
        return [figureType.get('id'), figureType.get('figure_type')]
    });
    let allSeries = await Series.fetchAll().map(series => {
        return [series.get('id'), series.get('series_name')]
    });
    allSeries = [...allSeries, [0, 'add new']];
    let allCollections = await Collection.fetchAll().map(collection => {
        return [collection.get('id'), collection.get('collection_name')]
    });
    allCollections = [...allCollections, [0, 'add new']];
    let allMediums = await Medium.fetchAll().map(Medium => {
        return [Medium.get('id'), Medium.get('media_medium')]
    });
    let series = await Series.fetchAll({
        withRelated: ['mediums']
    });
    let seriesID = await series.pluck('id');
    let x = 0;
    let localMedium = [];
    for (let each of series) {
        let associatedMediums = await each.related('mediums').pluck('id');
        // console.log(each.toJSON())
        localMedium.push({
            [seriesID[x]]: associatedMediums
        });
        x = x + 1;
    }
    const figureForm = createFigureForm(allFigureTypes, allSeries, allCollections, allMediums);
    figureForm.handle(req, {
        success: async function (form) {
            const figure = new Figure();
            let { medium_id, series_id, collection_id, ...figureData } = form.data;
            if (series_id == 0) {
                const newSeries = new Series();
                newSeries.set('series_name', req.body['new-series']);
                await newSeries.save();
                console.log(newSeries.toJSON.id);
                const addedSeries = await Series.where({
                    series_name: req.body['new-series']
                }).fetch({
                    require: true
                })
                series_id = addedSeries.toJSON().id
                console.log(series_id)
            }
            if (collection_id == 0) {
                let manufacturer_id = -1;
                const checkManufacturer = await Manufacturer.where({
                    manufacturer_name: req.body['new-manufacturer']
                }).fetch({
                    require: false
                })
                if (!checkManufacturer) {
                    const newManufacturer = new Manufacturer();
                    newManufacturer.set('manufacturer_name', req.body['new-manufacturer']);
                    await newManufacturer.save();
                    const addedManufacturer = await Manufacturer.where({
                        manufacturer_name: req.body['new-manufacturer']
                    }).fetch({
                        require: true
                    });
                    manufacturer_id = addedManufacturer.toJSON().id;
                }
                else {
                    manufacturer_id = checkManufacturer.toJSON().id;
                }
                const newCollection = new Collection();
                newCollection.set('collection_name', req.body['new-collection']);
                newCollection.set('manufacturer_id', manufacturer_id);
                await newCollection.save();
                const addedCollection = await Collection.where({
                    collection_name: req.body['new-collection']
                }).fetch({
                    require: true
                });
                collection_id = addedCollection.toJSON().id;
            }
            figure.set(figureData);
            figure.set('series_id', series_id);
            figure.set('collection_id', collection_id);
            figure.set('listing_date', moment().format());
            await figure.save();
            const series = await Series.where({
                id: series_id
            }).fetch({
                require: true,
                withRelated: ['mediums']
            });
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
        }
    })
})

router.get('/:figure_id/update', async function (req, res) {
    const figureID = req.params.figure_id;
    let figure = await Figure.where({
        id: figureID
    }).fetch({
        require: true
    });
    let associatedSeries = await Series.where({
        id: figure.toJSON().series_id
    }).fetch({
        require: true,
        withRelated: ['mediums']
    });
    figure.series = associatedSeries.toJSON();
    let allFigureTypes = await FigureType.fetchAll().map(figureType => {
        return [figureType.get('id'), figureType.get('figure_type')]
    });
    let allSeries = await Series.fetchAll().map(series => {
        return [series.get('id'), series.get('series_name')]
    });
    allSeries = [...allSeries, [0, 'add-new']];
    let allCollections = await Collection.fetchAll().map(collection => {
        return [collection.get('id'), collection.get('collection_name')]
    });
    allCollections = [...allCollections, [0, 'add new']];
    let allMediums = await Medium.fetchAll().map(Medium => {
        return [Medium.get('id'), Medium.get('media_medium')]
    });
    let series = await Series.fetchAll({
        withRelated: ['mediums']
    });
    let seriesID = await series.pluck('id');
    let x = 0;
    let localMedium = [];
    for (let each of series) {
        let associatedMediums = await each.related('mediums').pluck('id');
        localMedium.push({
            [seriesID[x]]: associatedMediums
        });
        x = x + 1;
    }
    const figureForm = createFigureForm(allFigureTypes, allSeries, allCollections, allMediums);
    figureForm.fields.name.value = figure.get('name');
    figureForm.fields.cost.value = figure.get('cost');
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
    });
    allSeries = [...allSeries, [0, 'add new']];
    let allCollections = await Collection.fetchAll().map(collection => {
        return [collection.get('id'), collection.get('collection_name')]
    });
    allCollections = [...allCollections, [0, 'add new']];
    let allMediums = await Medium.fetchAll().map(Medium => {
        return [Medium.get('id'), Medium.get('media_medium')]
    });
    let series = await Series.fetchAll({
        withRelated: ['mediums']
    });
    let seriesID = await series.pluck('id');
    let x = 0;
    let localMedium = [];
    for (let each of series) {
        let associatedMediums = await each.related('mediums').pluck('id');
        // console.log(each.toJSON())
        localMedium.push({
            [seriesID[x]]: associatedMediums
        });
        x = x + 1;
    }
    const figureForm = createFigureForm(allFigureTypes, allSeries, allCollections, allMediums);
    figureForm.handle(req, {
        success: async function (form) {
            let { medium_id, series_id, collection_id, ...figureData } = form.data;
            if (series_id == 0) {
                const newSeries = new Series();
                newSeries.set('series_name', req.body['new-series']);
                await newSeries.save();
                console.log(newSeries.toJSON.id);
                const addedSeries = await Series.where({
                    series_name: req.body['new-series']
                }).fetch({
                    require: true
                })
                series_id = addedSeries.toJSON().id
                console.log(series_id)
            }
            if (collection_id == 0) {
                let manufacturer_id = -1;
                const checkManufacturer = await Manufacturer.where({
                    manufacturer_name: req.body['new-manufacturer']
                }).fetch({
                    require: false
                })
                if (!checkManufacturer) {
                    const newManufacturer = new Manufacturer();
                    newManufacturer.set('manufacturer_name', req.body['new-manufacturer']);
                    await newManufacturer.save();
                    const addedManufacturer = await Manufacturer.where({
                        manufacturer_name: req.body['new-manufacturer']
                    }).fetch({
                        require: true
                    });
                    manufacturer_id = addedManufacturer.toJSON().id;
                }
                else {
                    manufacturer_id = checkManufacturer.toJSON().id;
                }
                const newCollection = new Collection();
                newCollection.set('collection_name', req.body['new-collection']);
                newCollection.set('manufacturer_id', manufacturer_id);
                await newCollection.save();
                const addedCollection = await Collection.where({
                    collection_name: req.body['new-collection']
                }).fetch({
                    require: true
                });
                collection_id = addedCollection.toJSON().id;
            }
            figure.set(figureData);
            figure.set('series_id', series_id);
            figure.set('collection_id', collection_id);
            figure.set('listing_date', moment().format());
            await figure.save();
            const series = await Series.where({
                id: series_id
            }).fetch({
                require: true,
                withRelated: ['mediums']
            });
            let selectedMediums = medium_id.split(',').map(id => parseInt(id));
            let existingMediumIds = await series.related('mediums').pluck('id');
            let toRemove = existingMediumIds.filter(id => !selectedMediums.includes(id));
            await series.mediums().detach(toRemove);
            await series.mediums().attach(selectedMediums);
            req.flash('success_messages', `${figureData.name} has been updated successfully`);
            res.redirect('/products');
        },
        error: async function (form) {
            req.flash('error_messages', `please check the fields again`)
            res.render('products/update', {
                form: form.toHTML(bootstrapField)
            })
        }
    })
})

router.post('/:figure_id/delete', async function (req, res) {
    let figureID = req.params.figure_id;
    let figure = await Figure.where({
        id: figureID
    }).fetch({
        require: true
    });
    await figure.destroy();
    req.flash('success_messages', `product has been deleted successfully`);
    res.redirect('/products')
})

module.exports = router;