const express = require('express');
const router = express.Router();
const moment = require('moment-timezone');
const ordersDataLayer = require('../dal/orders');
const { getFigureById, getCollectionByName } = require('../dal/products');
moment.tz.setDefault('Asia/Taipei');
const { createOrderStatusForm, bootstrapField, createSearchOrdersForm } = require('../forms');
const { Order, OrderStatus, OrderedItem } = require('../models');

router.get('/', async function (req, res) {
    let q = Order.collection();
    const allOrderStatus = await ordersDataLayer.getAllOrderStatuses();
    allOrderStatus.unshift([0, '---select order status---']);
    const searchForm = createSearchOrdersForm(allOrderStatus);
    searchForm.handle(req, {
        empty: async function (form) {
            let orders = await ordersDataLayer.getAllOrders(q);
            orders = orders.toJSON();
            for (let eachOrder of orders) {
                let orderedItems = await ordersDataLayer.getOrderedItems(eachOrder.id);
                eachOrder.orderedItems = orderedItems.toJSON()
            }
            res.render('orders/index', {
                orders: orders,
                form: form.toHTML(bootstrapField)
            })
        },
        success: async function (form) {
            if (form.data.order_id) {
                q.where('id', '=', form.data.order_id)
            };
            if (form.data.order_status_id && form.data.order_status_id != 0){
                q.where('order_status_id', '=', form.data.order_status_id)
            };
            if (form.data.order_date){
                let date = new Date(form.data.order_date);
                let day = 60 * 60 * 24 * 1000 - 1000;
                let endDate = new Date(date.getTime() + day);
                console.log(endDate)
                date = moment(date).format();
                endDate = moment(endDate).format();
                q.query(function (dateQuery) {
                    dateQuery.whereBetween('ordered_date', [date, endDate]);
                });
                q.orderBy('ordered_date', 'DESC')
            };

            if (form.data.payment_reference){
                q.where('payment_reference', '=', form.data.payment_reference)
            }

            let orders = await ordersDataLayer.getAllOrders(q);
            orders = orders.toJSON();
            for (let eachOrder of orders) {
                let orderedItems = await ordersDataLayer.getOrderedItems(eachOrder.id);
                eachOrder.orderedItems = orderedItems.toJSON()
            };
            res.render('orders/index', {
                orders: orders,
                form: form.toHTML(bootstrapField)
            });
        }
    });

    // res.render('orders/index', {
    //     orders: orders,
    //     form: searchForm.toHTML(bootstrapField)
    // })
});

router.get('/:order_id/update', async function (req, res) {
    let order = await ordersDataLayer.getOrderById(req.params.order_id);
    let orderId = order.get('id');
    const allOrderStatus = await ordersDataLayer.getAllOrderStatuses();
    const form = createOrderStatusForm(allOrderStatus);
    form.fields.order_status_id.value = order.get('order_status_id');
    let orderedItems = await ordersDataLayer.getOrderedItems(orderId);
    order = order.toJSON();
    order.orderedItems = orderedItems.toJSON();
    for (let each of order.orderedItems) {
        let figure = await getFigureById(each.figure_id);
        let collection = figure.toJSON().collection.collection_name;
        let manufacturer = await getCollectionByName(collection);
        manufacturer = manufacturer.toJSON();
        each.collection = collection;
        each.manufacturer = manufacturer.manufacturer.manufacturer_name;
    };
    console.log(order.orderedItems)
    res.render('orders/update_status', {
        order: order,
        form: form.toHTML(bootstrapField)
    })
});

router.post('/:order_id/update', async function (req, res) {
    let orderId = req.params.order_id;
    let order = await ordersDataLayer.getOrderById(req.params.order_id);
    const allOrderStatus = await ordersDataLayer.getAllOrderStatuses();
    const form = createOrderStatusForm(allOrderStatus);
    form.handle(req, {
        success: async function (form) {
            order.set(form.data);
            order.set('updated_date', moment().format());
            await order.save();
            req.flash('success_messages', 'successfully updated order');
            res.redirect(`/orders/${orderId}/update`)
        },
        empty: async function (form) {
        }
    })
});

module.exports = router;