const { CartItem } = require('../models');

const getCart = async (customerId) => {
    return await CartItem.collection().where({
        customer_id: customerId
    }).fetch({
        require: false,
        withRelated: ['figure', 'figure.series', 'figure.collection']
    })
    
}

const getCartItemByUserAndFigure = async (customerId, figureId) => {
    return await CartItem.where({
        customer_id: customerId,
        figure_id: figureId
    }).fetch({
        require: false
    })
}

const createCartItem = async (customerId, figureId, quantity) => {
    let cartItem = new CartItem({
        customer_id: customerId,
        figure_id: figureId,
        quantity: quantity
    });
    await cartItem.save();
    return cartItem
}

const removeFromCart = async (customerId, figureId) => {
    let cartItem = await getCartItemByUserAndFigure(customerId, figureId);
    if (cartItem){
        await cartItem.destroy();
        return true
    }
    return false
}

const updateQuantity = async (customerId, figureId, newQuantity) => {
    let cartItem = await getCartItemByUserAndFigure(customerId, figureId);
    if (cartItem){
        cartItem.set('quantity', newQuantity);
        cartItem.save();
        return true
    }
    return false
}

module.exports = { getCart, getCartItemByUserAndFigure, createCartItem,removeFromCart, updateQuantity }