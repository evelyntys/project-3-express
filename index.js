const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
require('dotenv').config();

let app = express();

app.set('view engine', 'hbs');

app.use(express.static('public'));

wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts');

app.use(express.urlencoded({
    extended: false
}))

app.get('/', function(req,res){
    // res.send('welcome to the api for figuya')
    res.render('index')
})

const productRoutes = require('./routes/products');
app.use('/products', productRoutes)

app.listen(3000, function(){
    console.log('server started')
})