const express = require('express');
const cartServices = require('../../services/cart_services');
const { Figure } = require('../../models');
const router = express.Router();

router.get('/', async function (req, res) {
    let customerId = req.query.customer_id;
    let cart = await cartServices.getCart(customerId);
    res.send(cart);
});

router.get('/:figure_id/add', async function (req, res) {
    let customerId = req.query.customer_id;
    let figureId = req.params.figure_id;
    let quantity = req.query.quantity;
    let error = {}
    let figure = await cartServices.getFigureById(figureId);
    if (figure.get('quantity') > quantity) {
        let checkIfItemExist = await cartServices.getCartItemByUserAndFigure(customerId, figureId);
        if (checkIfItemExist) {
            await cartServices.setQuantity(customerId, figureId, quantity);
        } else {
            await cartServices.addToCart(customerId, figureId, 1)
        }
    } else {
        error.errorMessage = 'not enough stock quantity for this product';
    }
    let cart = await cartServices.getCart(customerId);
    if (error.length == 0) {
        res.status(200);
        res.json({
            cart: cart
        })
    } else {
        res.status(400);
        res.json({
            error,
            cart
        })
    }
});

router.get('/:figure_id/remove', async function (req, res) {
    let customerId = req.query.customer_id;
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
    let customerId = req.query.customer_id;
    let figureId = req.params.figure_id;
    let figure = await cartServices.getFigureById(figureId);
    let message = "";
    figure = figure.toJSON();
    if (req.body.newQuantity <= figure.quantity) {
        await cartServices.setQuantity(req.session.customer.id, req.params.figure_id, req.body.newQuantity);
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