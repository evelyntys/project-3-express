const express = require('express');
const router = express.Router();
const moment = require('moment');
const { createFigureForm, bootstrapField } = require('../forms');
const { Figure, FigureType, Series, Collection, Manufacturer, Grouping } = require('../models')

router.get('/', async function (req, res) {
    let figures = await Figure.collection().fetch({
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
            withRelated: ['groupings']
        })
        series = series.toJSON();
        each.series = series;
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
    allSeries = [...allSeries, [0, 'add new']]
    let allCollections = await Collection.fetchAll().map(collection => {
        return [collection.get('id'), collection.get('collection_name')]
    });
    let allGroupings = await Grouping.fetchAll().map(grouping => {
        return [grouping.get('id'), grouping.get('group_name')]
    });
    const figureForm = createFigureForm(allFigureTypes, allSeries, allCollections, allGroupings);
    let series = await Series.fetchAll({
        withRelated: ['groupings']
    });
    for (let each of series) {
        let associatedGroupings = await each.related('groupings').pluck('id');
        figureForm.fields.grouping_id.value = associatedGroupings;
        // each.toJSON()['groupingID'] = associatedGroupings
        // console.log(each.toJSON().groupingID)
    }
    // console.log(series.toJSON())
    res.render('products/create', {
        figureForm: figureForm.toHTML(bootstrapField),
        series: series.toJSON()
    })
});

router.post('/create/change-series', async function(req,res){
    console.log(req.body)
    console.log(req.body.selectedSeries)
    let series = await Series.where({
        id: parseInt(req.body.selectedSeries)
    }).fetch({
        withRelated: ['groupings']
    });
    let allFigureTypes = await FigureType.fetchAll().map(figureType => {
        return [figureType.get('id'), figureType.get('figure_type')]
    });
    let allSeries = await Series.fetchAll().map(series => {
        return [series.get('id'), series.get('series_name')]
    });
    allSeries = [...allSeries, [0, 'add new']]
    let allCollections = await Collection.fetchAll().map(collection => {
        return [collection.get('id'), collection.get('collection_name')]
    });
    let allGroupings = await Grouping.fetchAll().map(grouping => {
        return [grouping.get('id'), grouping.get('group_name')]
    });
    const figureForm = createFigureForm(allFigureTypes, allSeries, allCollections, allGroupings);
    let selectedGroupings = await series.related('groupings').pluck('id');
    figureForm.fields.grouping_id.value = selectedGroupings;

})

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
    let allGroupings = await Grouping.fetchAll().map(grouping => {
        return [grouping.get('id'), grouping.get('group_name')]
    });
    const figureForm = createFigureForm(allFigureTypes, allSeries, allCollections, allGroupings);
    figureForm.handle(req, {
        success: async function (form) {
            const figure = new Figure();
            let { grouping_id, series_id, ...figureData } = form.data;
            console.log(req.body['new-series']);
            if (series_id == 0) {
                const newSeries = new Series();
                newSeries.set('series_name', req.body['new-series']);
                await newSeries.save();
                const addedSeries = await Series.where({
                    series_name: req.body['new-series']
                }).fetch({
                    require: true
                })
                series_id = newSeries.toJSON().id
                console.log(series_id)
            }
            figure.set(figureData);
            figure.set('series_id', series_id);
            figure.set('listing_date', moment().format());
            await figure.save();
            const series = await Series.where({
                id: series_id
            }).fetch({
                require: true,
                withRelated: ['groupings']
            });
            if (grouping_id) {
                await series.groupings().attach(grouping_id.split(','));
            };
            req.flash('success_messages', `new product ${figureData.name} has been added successfully`);
            res.redirect('/products');
        },
        error: async function (form) {
            req.flash('error_messages', 'please check the fields again')
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
    });
    let series = await Series.where({
        id: figure.toJSON().series_id
    }).fetch({
        require: true,
        withRelated: ['groupings']
    });
    figure.series = series.toJSON();
    let allFigureTypes = await FigureType.fetchAll().map(figureType => {
        return [figureType.get('id'), figureType.get('figure_type')]
    });
    let allSeries = await Series.fetchAll().map(series => {
        return [series.get('id'), series.get('series_name')]
    });
    let allCollections = await Collection.fetchAll().map(collection => {
        return [collection.get('id'), collection.get('collection_name')]
    });
    let allGroupings = await Grouping.fetchAll().map(grouping => {
        return [grouping.get('id'), grouping.get('group_name')]
    });
    const figureForm = createFigureForm(allFigureTypes, allSeries, allCollections, allGroupings);
    figureForm.fields.name.value = figure.get('name');
    figureForm.fields.cost.value = figure.get('cost');
    figureForm.fields.height.value = figure.get('height');
    figureForm.fields.launch_status.value = figure.get('launch_status');
    figureForm.fields.release_date.value = moment(figure.get('release_date')).format('YYYY-MM-DD');
    figureForm.fields.quantity.value = figure.get('quantity');
    figureForm.fields.figure_type_id.value = figure.get('figure_type_id');
    figureForm.fields.series_id.value = figure.get('series_id');
    figureForm.fields.collection_id.value = figure.get('collection_id');
    let selectedGroupings = await series.related('groupings').pluck('id');
    figureForm.fields.grouping_id.value = selectedGroupings;

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
    });
    let allCollections = await Collection.fetchAll().map(collection => {
        return [collection.get('id'), collection.get('collection_name')]
    });
    let allGroupings = await Grouping.fetchAll().map(grouping => {
        return [grouping.get('id'), grouping.get('group_name')]
    });
    const figureForm = createFigureForm(allFigureTypes, allSeries, allCollections, allGroupings);
    figureForm.handle(req, {
        success: async function (form) {
            let { grouping_id, ...figureData } = form.data;
            figure.set(figureData);
            figure.set('listing_date', moment().format());
            await figure.save();
            const series = await Series.where({
                id: figureData.series_id
            }).fetch({
                require: true,
                withRelated: ['groupings']
            });
            console.log(series.toJSON());
            let selectedGroupings = grouping_id.split(',').map(id => parseInt(id));
            let existingGroupingIds = await series.related('groupings').pluck('id');
            let toRemove = existingGroupingIds.filter(id => !selectedGroupings.includes(id));
            await series.groupings().detach(toRemove);
            await series.groupings().attach(selectedGroupings);
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
    let name = figure.name;
    await figure.destroy();
    req.flash('success_messages', `product has been deleted successfully`);
    res.redirect('/products')
})

module.exports = router;