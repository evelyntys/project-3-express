const express = require('express');
const router = express.Router();
const moment = require('moment-timezone');
const ordersDataLayer = require('../dal/orders');
moment.tz.setDefault('Asia/Taipei');
const { createOrderStatusForm, bootstrapField } = require('../forms');
const { Order, OrderStatus, OrderedItem } = require('../models');

router.get('/', async function (req, res) {
    let orders = await ordersDataLayer.getAllOrders();
    orders = orders.toJSON();
    for (let eachOrder of orders) {
        let orderedItems = await ordersDataLayer.getOrderedItems(eachOrder.id);
        eachOrder.orderedItems = orderedItems.toJSON()
    }
    res.render('orders/index', {
        orders: orders
    })
});

router.get('/:order_id/update', async function (req, res) {
    let order = await ordersDataLayer.getOrderById(req.params.order_id);
    const allOrderStatus = await ordersDataLayer.getAllOrderStatuses();
    const form = createOrderStatusForm(allOrderStatus);
    form.fields.order_status_id.value = order.get('order_status_id');
    res.render('orders/update_status', {
        form: form.toHTML(bootstrapField)
    })
});

router.post('/:order_id/update', async function (req, res) {
    let order = await ordersDataLayer.getOrderById(req.params.order_id);
    const allOrderStatus = await ordersDataLayer.getAllOrderStatuses();
    const form = createOrderStatusForm(allOrderStatus);
    form.handle(req, {
        success: async function (form) {
            order.set(form.data);
            order.set('updated_date', moment().format());
            await order.save();
            req.flash('success_messages', 'successfully updated order');
            res.redirect('/orders')
        },
        empty: async function (form) {

        }
    })
});

module.exports = router;