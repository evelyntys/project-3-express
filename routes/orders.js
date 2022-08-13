const express = require('express');
const router = express.Router();
const moment = require('moment');
const { createOrderStatusForm, bootstrapField } = require('../forms');
const { Order, OrderStatus, OrderedItem } = require('../models');

router.get('/', async function (req, res) {
    let orders = await Order.fetchAll({
        withRelated: ['order_status', 'ordered_items', 'customer']
    });
    // orders = orders.toJSON();
    for (let each of orders){
        let item = await OrderedItem.where({
            id: each.id
        }).fetch({
            required: true,
            withRelated: ['figure']
        })
        each.orderedItems = item
        // console.log(item.toJSON())
    };
    // orders.orderedItems = orderedItems;
    res.render('orders/index', {
        orders: orders.toJSON()
    })
    // res.send(orders.toJSON())
});

router.get('/:order_id/update', async function (req, res) {
    let order = await Order.where({
        id: req.params.order_id
    }).fetch({
        require: true,
        withRelated: ['order_status', 'ordered_items', 'customer']
    });
    const allOrderStatus = await OrderStatus.fetchAll().map(status => {
        return [status.get('id'), status.get('order_status')]
    });
    const form = createOrderStatusForm(allOrderStatus)
    res.render('orders/update_status', {
        form: form.toHTML(bootstrapField)
    })
})
module.exports = router;