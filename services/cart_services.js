const cartDataLayer = require('../dal/cart');

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

module.exports = { addToCart, removeFromCart, setQuantity, getCart }