const { Figure, FigureType, Series, Manufacturer, Collection, Medium } = require('../models');
const moment = require('moment');

async function getAllFigureTypes() {
    return await FigureType.fetchAll().map(figureType => {
        return [figureType.get('id'), figureType.get('figure_type')]
    });
};

async function getAllSeries(){
    return await Series.fetchAll().map(series => {
        return [series.get('id'), series.get('series_name')]
    });
};

async function displayFigures(query){
    let figures = await query.fetch({
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
        return figures
}

async function getAllCollections(){
    return await Collection.fetchAll().map(collection => {
        return [collection.get('id'), collection.get('collection_name')]
    });
};

async function getAllMediums(){
    return await Medium.fetchAll().map(medium => {
        return [medium.get('id'), medium.get('media_medium')]
    });
}

module.exports = {
    getAllFigureTypes, getAllSeries, displayFigures, getAllCollections, getAllMediums
}