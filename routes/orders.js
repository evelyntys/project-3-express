const express = require('express');
const router = express.Router();
const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Taipei');
const { createOrderStatusForm, bootstrapField } = require('../forms');
const { Order, OrderStatus, OrderedItem } = require('../models');

router.get('/', async function (req, res) {
    let orders = await Order.fetchAll({
        withRelated: ['order_status', 'ordered_items', 'customer']
    });
    orders = orders.toJSON();
    for (let eachOrder of orders){
        let orderedItems = await OrderedItem.where({
            order_id: eachOrder.id
        }).fetchAll({
            required: true,
            withRelated: ['figure']
        });
        console.log(orderedItems.toJSON());
        // orderedItems.push(item.toJSON());
        eachOrder.orderedItems = orderedItems.toJSON()
        // console.log(eachOrder.orderedItems)
    }
    // console.log(orders)
    res.render('orders/index', {
        orders: orders
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
    const form = createOrderStatusForm(allOrderStatus);
    form.fields.order_status_id.value = order.get('order_status_id');
    res.render('orders/update_status', {
        form: form.toHTML(bootstrapField)
    })
});

router.post('/:order_id/update', async function(req,res){
    let order = await Order.where({
        id: req.params.order_id
    }).fetch({
        require: true,
        withRelated: ['order_status', 'ordered_items', 'customer']
    });
    const allOrderStatus = await OrderStatus.fetchAll().map(status => {
        return [status.get('id'), status.get('order_status')]
    });
    const form = createOrderStatusForm(allOrderStatus);
    form.handle(req, {
        success: async function(form){
            order.set(form.data);
            order.set('updated_date', moment().format());
            await order.save();
            req.flash('success_messages', 'successfully updated order');
            res.redirect('/orders')
        },
        empty: async function(form){

        }
    })
});

module.exports = router;