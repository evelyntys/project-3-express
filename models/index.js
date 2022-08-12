const bookshelf = require('../bookshelf');

const Figure = bookshelf.model('Figure', {
    tableName: 'figures',
    figure_type() {
        return this.belongsTo('FigureType')
    },
    series() {
        return this.belongsTo('Series')
    },
    collection() {
        return this.belongsTo('Collection')
    }
});

const FigureType = bookshelf.model('FigureType', {
    tableName: 'figure_types',
    figures() {
        return this.hasMany('Figure')
    }
});

const Series = bookshelf.model('Series', {
    tableName: 'series',
    figures() {
        return this.hasMany('Figure')
    },
    mediums(){
        return this.belongsToMany('Medium')
    }
});

const Collection = bookshelf.model('Collection', {
    tableName: 'collections',
    figures() {
        return this.hasMany('Figure')
    },
    manufacturer() {
        return this.belongsTo('Manufacturer')
    }
});

const Manufacturer = bookshelf.model('Manufacturer', {
    tableName: 'manufacturers',
    collections() {
        return this.hasMany('Collection')
    }
});

const Medium = bookshelf.model('Medium', {
    tableName: 'mediums',
    series() {
        return this.belongsToMany('Series')
    }
});


const Admin = bookshelf.model('Admin', {
    tableName: 'admins'
})

const Customer = bookshelf.model('Customer', {
    tableName: 'customers'
})

const CartItem = bookshelf.model('CartItem', {
    tableName: 'cart_items',
    figure(){
        return this.belongsTo('Figure')
    },
    customer(){
        return this.belongsTo('customer')
    }
})

module.exports = { Figure, FigureType, Series, Collection, Manufacturer, Medium, Admin, Customer, CartItem };