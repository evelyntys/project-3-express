const cartDataLayer = require('../dal/cart');
const productDataLayer = require('../dal/products');

async function addToCart(customerId, figureId, quantity) {
    let cartItem = await cartDataLayer.getCartItemByUserAndFigure(customerId, figureId);
    if (cartItem) {
        return await cartDataLayer.updateQuantity(customerId, figureId, cartItem.get('quantity') + 1);
    } else {
        let newCartItem = cartDataLayer.createCartItem(customerId, figureId, quantity);
        return newCartItem
    }
};

async function removeFromCart(customerId, figureId) {
    return await cartDataLayer.removeFromCart(customerId, figureId)
};

async function setQuantity(customerId, figureId, quantity) {
    return await cartDataLayer.updateQuantity(customerId, figureId, quantity);
};

async function getCart(customerId) {
    return await cartDataLayer.getCart(customerId);
}

async function getFigureById(figureId) {
    return await productDataLayer.getFigureById(figureId)
}

async function getCartItemByUserAndFigure(customerId, figureId) {
    return await cartDataLayer.getCartItemByUserAndFigure(customerId, figureId)
}

module.exports = { addToCart, removeFromCart, setQuantity, getCart, getFigureById, getCartItemByUserAndFigure }