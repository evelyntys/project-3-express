const express = require('express');
const { getAllManufacturers, getManufacturerByName, addNewManufacturer } = require('../dal/products');
const { updateManufacturerForm, bootstrapField, updateCollectionForm } = require('../forms');
const { Collection, Manufacturer, Figure } = require('../models');
const router = express.Router();

router.get('/collection', async function (req, res) {
    let collections = await Collection.fetchAll({
        require: true,
        withRelated: ['manufacturer']
    })
    res.render('product-details/index', {
        collections: collections.toJSON()
    })
});

router.get('/collection/create', async function (req, res) {
    let manufacturers = await getAllManufacturers();
    manufacturers.push([0, '---add new manufacturer---']);
    const form = updateCollectionForm(manufacturers);
    res.render('product-details/update-coll', {
        createColl: form.toHTML(bootstrapField)
    })
});

router.post('/collection/create', async function (req, res) {
    let manufacturers = await getAllManufacturers();
    manufacturers.push([0, '---add new manufacturer---']);
    const form = updateCollectionForm(manufacturers);
    form.handle(req, {
        success: async function (form) {
            let { manufacturer_id, collection_name } = form.data;
            if (manufacturer_id == 0) {
                manufacturer_id = await addNewManufacturer(req.body['new-manufacturer'])
            };
            let newColl = new Collection();
            newColl.set('manufacturer_id', manufacturer_id);
            newColl.set('collection_name', collection_name);
            await newColl.save();
            res.redirect('/details/collection')
        },
        empty: function (form) {
            res.render('product-details/update-coll', {
                createColl: form.toHTML(bootstrapField)
            })
        },
        error: function (form) {
            res.render('product-details/update-coll', {
                createColl: form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/collection/:id/update', async function (req, res) {
    let collectionId = req.params.id;
    let collection = await Collection.where({
        id: collectionId
    }).fetch({
        withRelated: ['manufacturer']
    });
    let manufacturers = await getAllManufacturers();
    manufacturers.push([0, '---add new manufacturer---']);
    const form = updateCollectionForm(manufacturers);
    form.fields.collection_name.value = collection.get('collection_name');
    form.fields.manufacturer_id.value = collection.get('manufacturer_id');
    res.render('product-details/update-coll', {
        updateColl: form.toHTML(bootstrapField)
    })
});

router.post('/collection/:id/update', async function (req, res) {
    let collectionId = req.params.id;
    let collection = await Collection.where({
        id: collectionId
    }).fetch({
        withRelated: ['manufacturer']
    });
    let manufacturers = await getAllManufacturers();
    manufacturers.push([0, '---add new manufacturer---']);
    const form = updateCollectionForm(manufacturers);
    form.handle(req, {
        success: async function (form) {
            let { manufacturer_id, collection_name } = form.data;
            if (manufacturer_id == 0) {
                manufacturer_id = await addNewManufacturer(req.body['new-manufacturer'])
            };
            collection.set('manufacturer_id', manufacturer_id);
            collection.set('collection_name', collection_name);
            await collection.save();
            res.redirect('/details/collection')
        },
        empty: function (form) {
            res.render('product-details/update-coll', {
                updateColl: form.toHTML(bootstrapField)
            })
        },
        error: function (form) {
            res.render('product-details/update-coll', {
                updateColl: form.toHTML(bootstrapField)
            })
        }
    })
});

router.get('/collection/:id/delete', async function (req, res) {
    let collectionId = req.params.id;
    let collection = await Collection.where({
        id: collectionId
    }).fetch();
    res.render('product-details/delete', {
        collection: collection.toJSON()
    })

});

router.post('/collection/:id/delete', async function (req, res) {
    let collectionId = req.params.id;
    let collection = await Collection.where({
        id: collectionId
    }).fetch({
        withRelated: ['manufacturer', 'figures']
    });
    let figureCheck = await Figure.where({
        collection_id: collectionId
    }).fetch({
        require: false
    });
    if (figureCheck) {
        req.flash('error_messages', 'Unable to delete collection as there are existing figures')
    } else {
        await collection.destroy();
        req.flash('success_messages', 'Collection has been successfully deleted');
    }
    res.redirect('/details/collection')
})

router.get('/manufacturer', async function (req, res) {
    let manufacturers = await Manufacturer.fetchAll({
        require: true,
        withRelated: ['collections']
    });
    res.render('product-details/index', {
        manufacturers: manufacturers.toJSON()
    })
});

router.get('/manufacturer/create', async function (req, res) {
    const form = updateManufacturerForm();
    res.render('product-details/update-manu', {
        createManu: form.toHTML(bootstrapField)
    })
});

router.post('/manufacturer/create', async function (req, res) {
    const form = updateManufacturerForm();
    form.handle(req, {
        success: async function (form) {
            let newManu = new Manufacturer();
            newManu.set(form.data);
            await newManu.save();
            req.flash('success_messages', 'New manufacturer successfully added')
            res.redirect('/details/manufacturer');
        },
        empty: function (form) {
            res.render('product-details/update-manu', {
                createManu: form.toHTML(bootstrapField)
            })
        },
        error: function (form) {
            res.render('product-details/update-manu', {
                createManu: form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/manufacturer/:id/update', async function (req, res) {
    let manuId = req.params.id;
    let manufacturer = await Manufacturer.where({
        id: manuId
    }).fetch({
        require: true
    });
    const form = updateManufacturerForm();
    form.fields.manufacturer_name.value = manufacturer.get('manufacturer_name');
    res.render('product-details/update-manu', {
        manufacturer: manufacturer.toJSON(),
        updateManu: form.toHTML(bootstrapField)
    })
});

router.post('/manufacturer/:id/update', async function (req, res) {
    let manuId = req.params.id;
    let manufacturer = await Manufacturer.where({
        id: manuId
    }).fetch({
        require: true
    });
    const form = updateManufacturerForm();
    form.handle(req, {
        success: async function (form) {
            manufacturer.set(form.data);
            await manufacturer.save();
            res.redirect('/details/manufacturer')
        },
        empty: function (form) {
            res.render('product-details/update-manu', {
                manufacturer: manufacturer.toJSON(),
                updateManu: form.toHTML(bootstrapField)
            })
        },
        error: function (form) {
            res.render('product-details/update-manu', {
                manufacturer: manufacturer.toJSON(),
                updateManu: form.toHTML(bootstrapField)
            })
        }
    })
});

router.get('/manufacturer/:id/delete', async function (req, res) {
    let manuId = req.params.id;
    let manufacturer = await Manufacturer.where({
        id: manuId
    }).fetch({
        require: true
    });
    res.render('product-details/delete', {
        manufacturer: manufacturer.toJSON()
    })

});

router.post('/manufacturer/:id/delete', async function (req, res) {
    let manuId = req.params.id;
    let manufacturer = await Manufacturer.where({
        id: manuId
    }).fetch({
        require: true,
        withRelated: ['collections']
    });
    console.log(manufacturer)
    console.log(manufacturer.toJSON())
    let collections = manufacturer.toJSON().collections;
    let figureCheck = 0;
    for (let each of collections) {
        let figures = await Figure.where({
            collection_id: each.id
        }).fetchAll({
            require: false
        })
        if (figures) {
            figureCheck += 1
        }
    }
    if (figureCheck) {
        req.flash('error_messages', 'Unable to delete manufacturer as there are existing collections & figures')
    } else {
        await manufacturer.destroy();
        req.flash('success_messages', 'Manufacturer has been successfully deleted');
    }
    res.redirect('/details/manufacturer')
})


module.exports = router;