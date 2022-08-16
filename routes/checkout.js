const express = require('express');
const { Order, OrderedItem, Customer, Figure } = require('../models');
const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Taipei');
const router = express.Router();
const CartServices = require('../services/cart_services');
const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY,
    { apiVersion: '2020-08-27' });

router.get('/', async function (req, res) {
    let items = await CartServices.getCart(req.session.customer.id);
    let lineItems = [];
    let meta = [];
    for (let eachItem of items) {
        const lineItem = {
            name: eachItem.related('figure').get('name'),
            amount: eachItem.related('figure').get('cost'),
            quantity: eachItem.get('quantity'),
            currency: 'SGD'
        }
        if (eachItem.related('figure').get('image_url')) {
            lineItem['images'] = [eachItem.related('figure').get('image_url')]
        };
        lineItems.push(lineItem);
        meta.push({
            figure_id: eachItem.get('figure_id'),
            quantity: eachItem.get('quantity')
        })
    }
    console.log(lineItems);

    let metaData = JSON.stringify(meta);
    const payment = {
        payment_method_types: ['card'],
        line_items: lineItems,
        success_url: process.env.STRIPE_SUCCESS_URL + '?sessionId={CHECKOUT_SESSION_ID}',
        cancel_url: process.env.STRIPE_CANCEL_URL,
        customer_email: req.session.customer.email,
        metadata: {
            orders: metaData,
            customer_id: req.session.customer.id
        }
    };
    let quantityCheck = 0;
    for (let each of meta) {
        let figure = await Figure.where({
            id: each.figure_id
        }).fetch({
            required: true
        });
        if (figure.get('quantity') < each.quantity) {
            quantityCheck += 1;
        }
        //     else{
        //     const stripe = Stripe(proccess.env.STRIPE_PUBLISHABLE_KEY);
        //     stripe.redirectToCheckout({
        //         sessionId: stripeSession.id
        //     })
        //     res.render('checkout/checkout', {
        //         sessionId: stripeSession.id,
        //         publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
        //     })
        // }
    }
    if (quantityCheck > 0) {
        req.flash('error_messages', 'theres not enough stock honey..xx')
        res.redirect('/cart')
    }
    else {
        let stripeSession = await Stripe.checkout.sessions.create(payment);
        // res.status(303);
        res.redirect(303, stripeSession.url);
    }
});

router.get('/cancel', function (req, res) {
    res.redirect('/cart')
});

router.get('/success', function (req, res) {
    req.flash('success_messages', 'checked out successfully');
    res.redirect('/cart');
});

router.post('/process_payment', express.raw({ type: 'application/json' }), async function (req, res) {
    let payload = req.body;
    let endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
    let sigHeader = req.headers['stripe-signature'];
    let event = null;
    try {
        event = Stripe.webhooks.constructEvent(payload, sigHeader, endpointSecret);
        let stripeEvent = event.data.object;
        if (event.type == 'checkout.session.completed') {
            let customer = await Customer.where({
                id: stripeEvent.metadata.customer_id
            }).fetch({
                required: true
            });
            let address = customer.toJSON().street + ", " + customer.toJSON().unit + ", " + customer.toJSON().postal;
            let order = new Order();
            order.set('ordered_date', moment().format());
            order.set('customer_id', stripeEvent.metadata.customer_id);
            order.set('address', address)
            order.set('total_cost', stripeEvent.amount_total);
            order.set('payment_reference', stripeEvent.payment_intent);
            await order.save();
            let orderID = order.get('id');
            const metadata = JSON.parse(event.data.object.metadata.orders);
            for (let each of metadata) {
                let orderedItem = new OrderedItem();
                let figure = await Figure.where({
                    id: each.figure_id
                }).fetch({
                    required: true
                });
                orderedItem.set('order_id', orderID);
                orderedItem.set('figure_id', each.figure_id);
                orderedItem.set('quantity', each.quantity);
                await orderedItem.save();
                figure.set('quantity', (figure.get('quantity') - each.quantity))
                await figure.save();
                console.log('meta => ', metadata);
            }
            res.send({
                'success': true
            });
        }
    } catch (e) {
        res.send({
            error: e.message
        });
        console.log(e.message)
    }
})

module.exports = router;