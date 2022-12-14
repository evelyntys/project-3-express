const express = require('express');
const router = express.Router();
const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Taipei');
const ordersDataLayer = require('../dal/orders');
const { getFigureById, getCollectionByName } = require('../dal/products');
const { createOrderStatusForm, bootstrapField, createSearchOrdersForm, createRemarksForm } = require('../forms');
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
            };
            let completed = orders.filter(each => {
                return each.order_status_id >= 5
            });
            let incomplete = orders.filter(each => {
                return each.order_status_id < 5
            })
            res.render('orders/index', {
                completed: completed,
                incomplete: incomplete,
                totalOrders: completed.length + incomplete.length,
                form: form.toHTML(bootstrapField)
            })
        },
        success: async function (form) {
            let queryTerm = "like";
            if (process.env.DB_DRIVER == "postgres") {
                queryTerm = "ilike"
            }
            if (form.data.order_id) {
                q.where('id', '=', form.data.order_id)
            };

            if (form.data.email) {
                q.query('join', 'customers', 'customers.id', '=', 'customer_id')
                    .where('email', queryTerm, '%' + form.data.email + '%')
            }

            if (form.data.order_status_id && form.data.order_status_id != 0) {
                q.where('order_status_id', '=', form.data.order_status_id)
            };

            if (form.data.payment_reference) {
                q.where('payment_reference', '=', form.data.payment_reference)
            };

            let orders = await ordersDataLayer.getAllOrders(q);
            orders = orders.toJSON();
            for (let eachOrder of orders) {
                let orderedItems = await ordersDataLayer.getOrderedItems(eachOrder.id);
                eachOrder.orderedItems = orderedItems.toJSON();
                console.log(eachOrder.ordered_date);
            };

            if (form.data.ordered_date) {
                orders = orders.filter(each => {
                    return moment(each.ordered_date).format("YYYY-MM-DD") == form.data.ordered_date
                })
            };

            let completed = orders.filter(each => {
                return each.order_status_id >= 5
            });
            let incomplete = orders.filter(each => {
                return each.order_status_id < 5
            });

            res.render('orders/index', {
                completed: completed,
                incomplete: incomplete,
                totalOrders: completed.length + incomplete.length,
                form: form.toHTML(bootstrapField)
            });
        }
    });
});

router.get('/:order_id/update', async function (req, res) {
    let order = await ordersDataLayer.getOrderById(req.params.order_id);
    let orderId = order.get('id');
    const allOrderStatus = await ordersDataLayer.getAllOrderStatuses();
    const statusForm = createOrderStatusForm(allOrderStatus);
    const remarksForm = createRemarksForm();
    statusForm.fields.order_status_id.value = order.get('order_status_id');
    remarksForm.fields.remarks.value = order.get('remarks');
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
    res.render('orders/update_status', {
        order: order,
        statusForm: statusForm.toHTML(bootstrapField),
        remarksForm: remarksForm.toHTML(bootstrapField)
    })
});

router.post('/:order_id/update', async function (req, res) {
    let orderId = req.params.order_id;
    let order = await ordersDataLayer.getOrderById(req.params.order_id);
    const allOrderStatus = await ordersDataLayer.getAllOrderStatuses();
    const statusForm = createOrderStatusForm(allOrderStatus);
    const remarksForm = createRemarksForm();
    statusForm.handle(req, {
        success: async function (form) {
            order.set(form.data);
            order.set('updated_date', moment().format());
            await order.save();
        },
        empty: async function (form) {
        }
    });
    remarksForm.handle(req, {
        success: async function (form) {
            order.set(form.data);
            await order.save();
            req.flash('success_messages', `Successfully updated order #${orderId}`);
            res.redirect(`/orders/${orderId}/update`);
        },
        empty: async function (form) {
        }
    })
});

module.exports = router;