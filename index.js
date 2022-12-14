const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');

const cors = require('cors');

const session = require('express-session');
const flash = require('connect-flash');
const FileStore = require('session-file-store')(session);
const { CheckIfAdmin, checkIfJWT } = require('./middlewares');
const csrf = require('csurf');
const moment = require('moment');
var helpers = require('handlebars-helpers')({
    handlebars: hbs.handlebars
});
const csrfInstance = csrf();
require('dotenv').config();

hbs.registerHelper('costWithDecimal', function (value) {
    return ((value / 100).toFixed(2))
});

hbs.registerHelper('displayDate', function (date) {
    return moment(date).format('DD/MM/YYYY')
});

hbs.registerHelper('displayDateTime', function (date) {
    return moment(date).format('DD/MM/YYYY, LTS')
});

hbs.registerHelper('arraySum', function (array1, array2) {
    return array1.length + array2.length
});

let app = express();

app.set('view engine', 'hbs');

app.use(cors());

app.use(express.static('public'));

wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts');

app.use(express.urlencoded({
    extended: false
}));

app.use(flash());

app.use(session({
    store: new FileStore(),
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true
}));

app.use(function (req, res, next) {
    if (req.url === '/checkout/process_payment' || req.url.slice(0, 5) == '/api/') {
        return next();
    }
    csrfInstance(req, res, next);
})

app.use(function (req, res, next) {
    res.locals.admin = req.session.admin;
    if (req.csrfToken) {
        res.locals.csrfToken = req.csrfToken();
    }
    res.locals.success_messages = req.flash('success_messages');
    res.locals.error_messages = req.flash('error_messages');
    next();
})

app.use(function (err, req, res, next) {
    if (err && err.code == "EBADCSRFTOKEN") {
        req.flash('error_messages', 'The form has expired. Please try again');
        res.redirect('back');
    } else {
        next()
    }
});

const landingRoutes = require('./routes/landing');
const productRoutes = require('./routes/products');
const cloudinaryRoutes = require('./routes/cloudinary');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admins');
const detailRoutes = require('./routes/product-details');
const api = {
    products: require('./routes/api/products'),
    cart: require('./routes/api/cart'),
    customers: require('./routes/api/customers'),
    checkout: require('./routes/api/checkout'),
    orders: require('./routes/api/orders')
}
app.use('/', landingRoutes);
app.use('/products', CheckIfAdmin, productRoutes);
app.use('/cloudinary', cloudinaryRoutes);
app.use('/orders', CheckIfAdmin, orderRoutes);
app.use('/admins', CheckIfAdmin, adminRoutes);
app.use('/details', CheckIfAdmin, detailRoutes);
app.use('/api/products', express.json(), api.products);
app.use('/api/cart', express.json(), checkIfJWT, api.cart);
app.use('/api/users', express.json(), api.customers);
app.use('/api/checkout', api.checkout);
app.use('/api/orders', express.json(), checkIfJWT, api.orders);

app.listen(process.env.PORT, function () {
    console.log('server started')
})