const { Order, OrderedItem, OrderStatus } = require("../models");

async function getAllOrderStatuses() {
    return await OrderStatus.fetchAll().map(status => {
        return [status.get('id'), status.get('order_status')]
    });
};

async function getAllOrders(query) {
    return await query.orderBy('id', 'asc').fetch({
        withRelated: ['order_status', 'ordered_items', 'customer', 'shipping_type']
    });
};

async function getOrderedItems(orderId) {
    return await OrderedItem.where({
        order_id: orderId
    }).fetchAll({
        required: true,
        withRelated: ['figure']
    });
};

async function getOrderById(orderId) {
    return await Order.where({
        id: orderId
    }).fetch({
        require: false,
        withRelated: ['order_status', 'ordered_items', 'customer', 'shipping_type']
    });
};

async function getOrderByCustomerId(customerId) {
    return await Order.where({
        customer_id: customerId
    }).orderBy('ordered_date', 'desc').fetchAll({
        require: false,
        withRelated: ['order_status', 'ordered_items', 'shipping_type']
    });
};

async function getOrderItemsByFigureId(figureId) {
    return await OrderedItem.where({
        figure_id: figureId
    }).fetchAll({
        require: false
    })
}

module.exports = {
    getAllOrders, getOrderedItems, getOrderById, getAllOrderStatuses
    , getOrderByCustomerId, getOrderItemsByFigureId
}