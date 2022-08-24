const express = require('express');
const cartServices = require('../../services/cart_services');
const { Figure } = require('../../models');
const router = express.Router();

router.get('/', async function (req, res) {
    let customerId = req.customer.id;
    let cart = await cartServices.getCart(customerId);
    res.send(cart);
});

router.get('/:figure_id/add', async function (req, res) {
    let customerId = req.customer.id;
    let figureId = parseInt(req.params.figure_id);
    let quantity = parseInt(req.query.quantity);
    let errorMsg = [];
    console.log(quantity);
    let checkIfItemExist = await cartServices.getCartItemByUserAndFigure(customerId, figureId);
    let addToCart = false;
    if (checkIfItemExist) {
        addToCart = await cartServices.setQuantity(customerId, figureId, quantity);
    } else {
        addToCart = await cartServices.addToCart(customerId, figureId, quantity);
    }
    if (!addToCart) {
        errorMsg.push({errorMessage: 'not enough stock quantity for this product'})
    }
    // let figure = await cartServices.getFigureById(figureId);
    // if (figure.get('quantity') >= quantity) {
    //     let checkIfItemExist = await cartServices.getCartItemByUserAndFigure(customerId, figureId);
    //     console.log(checkIfItemExist);
    //     if (checkIfItemExist) {
    //         console.log('here')
    //         await cartServices.setQuantity(customerId, figureId, quantity);
    //     } else {
    //         console.log('no')
    //         await cartServices.addToCart(customerId, figureId, 1);
    //     }
    // } else {
    //     errorMsg.push({errorMessage: 'not enough stock quantity for this product'})
    //     console.log(errorMsg.errorMessage);
    // }
    let cart = await cartServices.getCart(customerId);
    if (errorMsg.length == 0) {
        res.status(200);
        res.json({
            cart
        })
    } else {
        res.status(400);
        res.json({
            errorMsg,
            cart
        })
    }
});

router.get('/:figure_id/remove', async function (req, res) {
    let customerId = req.customer.id;
    let figureId = req.params.figure_id;
    await cartServices.removeFromCart(customerId, figureId);
    let cart = await cartServices.getCart(customerId);
    res.status(200)
    res.json({
        message: 'cart item removed',
        cart
    })
});

router.post('/:figure_id/quantity/update', async function (req, res) {
    let customerId = req.customer.id;
    let figureId = req.params.figure_id;
    let newQuantity = req.body.newQuantity;
    let figure = await cartServices.getFigureById(figureId);
    let message = "";
    figure = figure.toJSON();
    if (newQuantity <= figure.quantity) {
        await cartServices.setQuantity(customerId, figureId, newQuantity);
        message = 'quantity successfully updated';
        res.status(200);
    } else {
        message = 'stock quantity not enough for this product';
        res.status(400);
    }
    let cart = await cartServices.getCart(customerId);
    res.json({
        message,
        cart
    })
})

module.exports = router;