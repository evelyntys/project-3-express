const { Order, OrderedItem, OrderStatus } = require("../models");

async function getAllOrderStatuses(){
    return await OrderStatus.fetchAll().map(status => {
        return [status.get('id'), status.get('order_status')]
    });
};

async function getAllOrders() {
    return await Order.fetchAll({
        withRelated: ['order_status', 'ordered_items', 'customer']
    });
};

async function getOrderedItems(orderId){
    return await OrderedItem.where({
        order_id: orderId
    }).fetchAll({
        required: true,
        withRelated: ['figure']
    });
};

async function getOrderById(orderId){
    return await Order.where({
        id: orderId
    }).fetch({
        require: true,
        withRelated: ['order_status', 'ordered_items', 'customer']
    });
};

module.exports = { getAllOrders, getOrderedItems, getOrderById, getAllOrderStatuses }