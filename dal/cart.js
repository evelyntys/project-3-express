const { CartItem } = require('../models');

async function getCart(customerId) {
    return await CartItem.collection().where({
        customer_id: customerId
    }).orderBy('figure_id', 'asc').fetch({
        require: false,
        withRelated: ['figure', 'figure.series', 'figure.collection']
    })

}

async function getCartItemByUserAndFigure(customerId, figureId) {
    return await CartItem.where({
        customer_id: customerId,
        figure_id: figureId
    }).fetch({
        require: false,
        withRelated: ['figure', 'figure.series', 'figure.collection']
    })
}

async function createCartItem(customerId, figureId, quantity) {
    let cartItem = new CartItem({
        customer_id: customerId,
        figure_id: figureId,
        quantity: quantity
    });
    await cartItem.save();
    return cartItem
}

async function removeFromCart(customerId, figureId) {
    let cartItem = await getCartItemByUserAndFigure(customerId, figureId);
    if (cartItem) {
        await cartItem.destroy();
        return true
    }
    return false
}

async function updateQuantity(customerId, figureId, newQuantity) {
    let cartItem = await getCartItemByUserAndFigure(customerId, figureId);
    if (cartItem) {
        cartItem.set('quantity', newQuantity);
        await cartItem.save();
        return true
    }
    return false
};

async function getCartByFigureId(figureId) {
    return cart = await CartItem.where({
        figure_id: figureId
    }).fetch({
        require: false
    });

}

module.exports = {
    getCart, getCartItemByUserAndFigure, createCartItem, removeFromCart, updateQuantity,
    getCartByFigureId
}