const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
const session = require('express-session');
const flash = require('connect-flash');
const FileStore = require('session-file-store')(session);
const { CheckIfAdmin } = require('./middlewares');
const csrf = require('csurf');
require('dotenv').config();

let app = express();

app.set('view engine', 'hbs');

app.use(express.static('public'));

wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts');

app.use(express.urlencoded({
    extended: false
}));

app.use(session ({
    store: new FileStore(),
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))

app.use(csrf());
app.use(function (err, req, res, next) {
    if (err && err.code == "EBADCSRFTOKEN") {
        req.flash('error_messages', 'The form has expired. Please try again');
        res.redirect('back');
    } else {
        next()
    }
});

app.use(flash());

app.use(function(req,res,next){
    res.locals.admin = req.session.admin;
    res.locals.csrfToken = req.csrfToken();
    res.locals.success_messages = req.flash('success_messages');
    res.locals.error_messages = req.flash('error_messages');
    next();
})

const landingRoutes = require('./routes/landing');
const productRoutes = require('./routes/products');
app.use('/', landingRoutes);
app.use('/products', CheckIfAdmin, productRoutes);

app.listen(3000, function(){
    console.log('server started')
})