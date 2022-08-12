const express = require('express');
const { getCart, getCartItemByUserAndFigure } = require('../dal/cart');
const router = express.Router();

const cartServices = require('../services/cart_services');

router.get('/', async function(req,res){
    let cart = await getCart(req.session.customer.id);
    console.log(cart.toJSON());
    res.render('cart/index', {
        cart: cart.toJSON()
    });
});

router.get('/:figure_id/add', async function(req,res){
    await cartServices.addToCart(req.session.customer.id, req.params.figure_id, 1);
    req.flash('error_messages', 'added to cart')
    res.redirect('/cart')
});

router.get('/:figure_id/remove', async function(req,res){
    // let cart = await getCartItemByUserAndFigure(req.session.customer.id, req.params.figure_id);
    await cartServices.removeFromCart(req.session.customer.id, req.params.figure_id);
    req.flash('error_messages', 'successfully removed');
    res.redirect('/cart')
});

router.post('/:figure_id/quantity/update', async function(req,res){
    await cartServices.setQuantity(req.session.customer.id, req.params.figure_id, req.body.newQuantity);
    req.flash('error_messages', 'successful quantity update');
    res.redirect('/cart')
})

module.exports = router;