const { Figure, FigureType, Series, Manufacturer, Collection, Medium } = require('../models');
const moment = require('moment');

async function getAllFigureTypes() {
    return await FigureType.fetchAll().map(figureType => {
        return [figureType.get('id'), figureType.get('figure_type')]
    });
};

async function getAllSeries() {
    return await Series.fetchAll().map(series => {
        return [series.get('id'), series.get('series_name')]
    });
};

async function getAllCollections() {
    return await Collection.fetchAll().map(collection => {
        return [collection.get('id'), collection.get('collection_name')]
    });
};

async function getAllMediums() {
    return await Medium.fetchAll().map(medium => {
        return [medium.get('id'), medium.get('media_medium')]
    });
};

async function getAllManufacturers() {
    return await Manufacturer.fetchAll().map(manufacturer => {
        return [manufacturer.get('id'), manufacturer.get('manufacturer_name')]
    })
}

async function displayFigures(query) {
    let figures = await query.fetch({
        withRelated: ['figure_type', 'series', 'collection']
    });
    figures = figures.toJSON();
    for (let each of figures) {
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
};

async function getAllSeriesFull() {
    return await Series.fetchAll({
        withRelated: ['mediums']
    });
};

async function getFigureById(figureId) {
    return await Figure.where({
        id: figureId
    }).fetch({
        require: true,
        withRelated: ['figure_type', 'series', 'collection']
    });
}

async function FigureByIdWithMediums(figureId) {
    let figure = await Figure.where({
        id: figureId
    }).fetch({
        require: true,
        withRelated: ['figure_type', 'series', 'collection']
    });
    figure = figure.toJSON();
    let manufacturer = await Manufacturer.where({
        id: figure.collection.manufacturer_id
    }).fetch({
        require: true,
    })
    manufacturer = manufacturer.toJSON();
    figure.manufacturer = manufacturer;
    let series = await Series.where({
        id: figure.series_id
    }).fetch({
        withRelated: ['mediums']
    })
    series = series.toJSON();
    figure.series = series;
    return figure
};

async function addNewSeries(seriesName) {
    const newSeries = new Series();
    newSeries.set('series_name', seriesName);
    await newSeries.save();
    return newSeries.get('id');
};

async function getManufacturerByName(manufacturerName) {
    return checkManufacturer = await Manufacturer.where({
        manufacturer_name: manufacturerName
    }).fetch({
        require: false
    });
};

async function addNewManufacturer(manufacturerName) {
    const newManufacturer = new Manufacturer();
    newManufacturer.set('manufacturer_name', manufacturerName);
    await newManufacturer.save();
    return newManufacturer.get('id');
};

async function getCollectionByName(collectionName) {
    return await Collection.where({
        collection_name: collectionName
    }).fetch({
        require: true,
        withRelated: ['manufacturer']
    });
}

async function addNewCollection(manufacturerName, collectionName) {
    let manufacturer_id = -1;
    const checkManufacturer = await getManufacturerByName(manufacturerName);
    if (!checkManufacturer) {
        manufacturer_id = await addNewManufacturer(manufacturerName);
    }
    else {
        manufacturer_id = checkManufacturer.toJSON().id;
    }
    const newCollection = new Collection();
    newCollection.set('collection_name', collectionName);
    newCollection.set('manufacturer_id', manufacturer_id);
    await newCollection.save();
    return newCollection.get('id');
};

async function getSeriesById(seriesId) {
    return await Series.where({
        id: seriesId
    }).fetch({
        require: true,
        withRelated: ['mediums']
    });
};

async function getRelatedMediumsForCheckbox() {
    let allSeries = await getAllSeriesFull();
    let IDsOfSeries = allSeries.pluck('id');
    let mediums = [];
    let x = 0;
    for (let each of allSeries) {
        let associatedMediums = await each.related('mediums').pluck('id');
        mediums.push({
            [IDsOfSeries[x]]: associatedMediums
        });
        x = x + 1;
    };
    return mediums
}

async function getValuesForForm() {
    let allFigureTypes = await getAllFigureTypes();
    allFigureTypes.unshift([-1, '---select a figure type---']);
    let allSeries = await getAllSeries();
    allSeries = [...allSeries, [0, '---add new---']];
    allSeries.unshift([-1, '---select a series---']);
    let allCollections = await getAllCollections();
    allCollections = [...allCollections, [0, '---add new---']];
    allCollections.unshift([-1, '---select a collection---']);
    let allMediums = await getAllMediums();
    return [allFigureTypes, allSeries, allCollections, allMediums];
}


module.exports = {
    getAllFigureTypes, getAllSeries, displayFigures, getAllCollections, getAllMediums,
    getAllSeriesFull, getFigureById, addNewSeries, getManufacturerByName,
    addNewManufacturer, addNewCollection, getSeriesById, getRelatedMediumsForCheckbox,
    getValuesForForm, getCollectionByName, getAllManufacturers, FigureByIdWithMediums
}