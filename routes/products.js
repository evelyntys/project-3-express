const express = require('express');
const router = express.Router();
const moment = require('moment');
const { createFigureForm, bootstrapField } = require('../forms');
const { Figure } = require('../models')

router.get('/', async function (req, res) {
    let figures = await Figure.collection().fetch();
    figures = figures.toJSON();
    for (let each of figures){
        each.release_date = moment(each.release_date).format('L')
        each.listing_date = moment(each.listing_date).format('L, LTS')
    }
    res.render('products/index', {
        figures
    });
})

router.get('/create', async function(req,res){
    const figureForm = createFigureForm().toHTML(bootstrapField);
    res.render('products/create', {
        figureForm
    })
})

router.post('/create', async function(req,res){
    const figureForm = createFigureForm();
    figureForm.handle(req, {
        success: async function(form){
            const figure = new Figure();
            figure.set(form.data);
            figure.set('listing_date', moment().format());
            await figure.save();
            res.redirect('/products')
        },
        error: async function(form){
            res.render('products/create', {
                figureForm: form.toHTML(bootstrapField)
            })
        }
    })

})

module.exports = router;