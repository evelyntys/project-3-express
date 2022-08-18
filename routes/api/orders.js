const express = require('express');
const router = express.Router();
const moment = require('moment-timezone');
const ordersDataLayer = require('../../dal/orders');
moment.tz.setDefault('Asia/Taipei');

router.get('/:customer_id', async function (req, res) {
    let customerId = req.params.customer_id;
    let orders = await ordersDataLayer.getOrderByCustomerId(customerId);
    orders = orders.toJSON();
    for (let eachOrder of orders) {
        let orderedItems = await ordersDataLayer.getOrderedItems(eachOrder.id);
        eachOrder.orderedItems = orderedItems.toJSON()
    }
    res.send(orders);
});

module.exports = router;