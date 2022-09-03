const cartDataLayer = require('../dal/cart');
const productDataLayer = require('../dal/products');

async function addToCart(customerId, figureId, quantity) {
    let figure = await getFigureById(figureId);
    if (figure.get('quantity') >= quantity) {
        let cartItem = await cartDataLayer.getCartItemByUserAndFigure(customerId, figureId);
        if (cartItem) {
            return await cartDataLayer.updateQuantity(customerId, figureId, cartItem.get('quantity') + 1);
        } else {
            let newCartItem = cartDataLayer.createCartItem(customerId, figureId, quantity);
            return newCartItem
        }
    } else {
        return false
    }
};

async function removeFromCart(customerId, figureId) {
    return await cartDataLayer.removeFromCart(customerId, figureId)
};

async function setQuantity(customerId, figureId, quantity) {
    let figure = await getFigureById(figureId);
    let figureQuantity = figure.get('quantity');
    if (quantity <= figureQuantity) {
        await cartDataLayer.updateQuantity(customerId, figureId, quantity);
        return true
    }
    return false
};

async function updateQuantity(customerId, figureId, newQuantity) {
    let cartItem = await getCartItemByUserAndFigure(customerId, figureId);
    let figureQuantity = cartItem.toJSON().figure.quantity
    if (cartItem) {
        if (newQuantity <= figureQuantity) {
            cartItem.set('quantity', newQuantity);
            await cartItem.save();
            return true
        }
    }
    return false
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

module.exports = {
    addToCart, removeFromCart,
    setQuantity, getCart, getFigureById,
    getCartItemByUserAndFigure, updateQuantity
}