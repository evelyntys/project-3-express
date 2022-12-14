const express = require('express');
const { Order, OrderedItem, Customer, Figure, ShippingType } = require('../../models');
const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Taipei');
const router = express.Router();
const CartServices = require('../../services/cart_services');
const { checkIfJWT } = require('../../middlewares');
const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY,
    { apiVersion: '2020-08-27' });

// variables for webhooks
let itemsOrdered = null;
let newOrder = {
    ordered_date: "",
    updated_date: "",
    shipping_type_id: "",
    customer_id: "",
    block_street: "",
    unit: "",
    postal: "",
    total_cost: "",
    payment_reference: "",
    payment_method: "",
    receipt_url: "",
};
let paymentCheck = false;
let checkoutCheck = false;

router.post('/', express.json(), checkIfJWT, async function (req, res) {
    let customerId = req.customer.id
    let customerEmail = req.body.customer_email;
    let block_street = req.body.block_street;
    let unit = req.body.unit;
    let postal = req.body.postal;
    let items = await CartServices.getCart(customerId);
    if (items.length > 0 && customerEmail) {
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
            payment_method_types: [],
            line_items: lineItems,
            success_url: process.env.STRIPE_SUCCESS_URL + '?sessionId={CHECKOUT_SESSION_ID}',
            cancel_url: process.env.STRIPE_CANCEL_URL,
            customer_email: customerEmail,
            allow_promotion_codes: true,
            shipping_options: [
                {
                    shipping_rate_data: {
                        type: 'fixed_amount',
                        fixed_amount: {
                            amount: 500,
                            currency: 'sgd',
                        },
                        display_name: 'Standard',
                        delivery_estimate: {
                            minimum: {
                                unit: 'business_day',
                                value: 5,
                            },
                            maximum: {
                                unit: 'business_day',
                                value: 7,
                            },
                        }
                    }
                },
                {
                    shipping_rate_data: {
                        type: 'fixed_amount',
                        fixed_amount: {
                            amount: 1000,
                            currency: 'sgd',
                        },
                        display_name: 'Express',
                        delivery_estimate: {
                            minimum: {
                                unit: 'business_day',
                                value: 1,
                            },
                            maximum: {
                                unit: 'business_day',
                                value: 2,
                            },
                        }
                    }
                },
            ],
            metadata: {
                orders: metaData,
                customer_id: customerId,
                block_street: block_street,
                unit: unit,
                postal: postal
            }
        };
        let quantityCheck = 0;
        for (let each of meta) {
            let figure = await CartServices.getFigureById(each.figure_id);
            if (figure.get('quantity') < each.quantity) {
                quantityCheck += 1;
            }
        }
        if (quantityCheck > 0) {
            res.status(400);
            res.json({
                message: 'not enough stock for the product(s)'
            })
        }
        else {
            let stripeSession = await Stripe.checkout.sessions.create(payment);
            // res.status(200);
            // res.send({
            //     sessionId: stripeSession.id, 
            //     publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
            // })
            res.status(200);
            res.send({ url: stripeSession.url })
        }
    }
    else {
        res.status(400);
        res.send({
            message: "no items in cart currently"
        })
    }
});

router.get('/cancel', function (req, res) {
    res.send('checkout cancelled')
});

router.get('/success', function (req, res) {
    res.send('successful checkout')
});

router.post('/process_payment', express.raw({ type: 'application/json' }), async function (req, res) {
    let payload = req.body;
    let endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
    let sigHeader = req.headers['stripe-signature'];
    let event = null;
    console.log("paymentCheck", paymentCheck);
    console.log("checkoutSuccess", checkoutCheck);
    try {
        event = Stripe.webhooks.constructEvent(payload, sigHeader, endpointSecret);
    } catch (e) {
        res.send({
            error: e.message
        });
        console.log(e.message)
    }
    if (event) {
        console.log('or here')
        let stripeEvent = event.data.object;
        console.log(stripeEvent);
        let order = new Order();
        if (event.type == 'payment_intent.succeeded') {
            console.log("PAYMENT", stripeEvent)
            console.log(stripeEvent.charges.data[0].payment_method_details.type);
            newOrder.payment_method = stripeEvent.charges.data[0].payment_method_details.type;
            newOrder.receipt_url = stripeEvent.charges.data[0].receipt_url;
            paymentCheck = true;
        };
        if (event.type == 'checkout.session.completed') {
            console.log("CHECKOUT", stripeEvent)
            let shippingAmount = stripeEvent.total_details.amount_shipping;
            let shipping = await ShippingType.where({
                amount: shippingAmount
            }).fetch({
                require: true
            });
            itemsOrdered = JSON.parse(stripeEvent.metadata.orders);
            newOrder.shipping_type_id = shipping.get('id');
            newOrder.customer_id = stripeEvent.metadata.customer_id;
            newOrder.block_street = stripeEvent.metadata.block_street;
            newOrder.unit = stripeEvent.metadata.unit;
            newOrder.postal = stripeEvent.metadata.postal;
            newOrder.total_cost = stripeEvent.amount_total;
            newOrder.payment_reference = stripeEvent.payment_intent;
            if (stripeEvent.total_details.amount_discount) {
                newOrder.coupon_used = "FREESHIPPING"
            }
            checkoutCheck = true;
        };

        if (paymentCheck && checkoutCheck) {
            newOrder.ordered_date = moment().format();
            newOrder.updated_date = moment().format();
            order.set(newOrder);
            await order.save();
            let orderID = order.get('id');
            for (let each of itemsOrdered) {
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
                console.log('ordered items => ', itemsOrdered);
            }
            let cart = await CartServices.getCart(newOrder.customer_id);
            for (let each of cart) {
                await each.destroy();
                console.log('error')
            };
        }
        res.send({
            'success': true
        });
    };
})

module.exports = router;