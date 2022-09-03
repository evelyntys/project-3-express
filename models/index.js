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
    mediums() {
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
});

const Customer = bookshelf.model('Customer', {
    tableName: 'customers',
    orders() {
        return this.hasMany('Order')
    }
});

const CartItem = bookshelf.model('CartItem', {
    tableName: 'cart_items',
    figure() {
        return this.belongsTo('Figure')
    },
    customer() {
        return this.belongsTo('Customer')
    }
});

const OrderStatus = bookshelf.model('OrderStatus', {
    tableName: 'order_statuses',
    orders() {
        return this.hasMany('Order')
    }
});

const Order = bookshelf.model('Order', {
    tableName: 'orders',
    order_status() {
        return this.belongsTo('OrderStatus')
    },
    ordered_items() {
        return this.hasMany('OrderedItem')
    },
    customer() {
        return this.belongsTo('Customer')
    },
    shipping_type() {
        return this.belongsTo('ShippingType')
    }
})

const OrderedItem = bookshelf.model('OrderedItem', {
    tableName: 'ordered_items',
    order() {
        return this.belongsTo('Order')
    },
    figure() {
        return this.belongsTo('Figure')
    }
});

const ShippingType = bookshelf.model('ShippingType', {
    tableName: 'shipping_types',
    orders() {
        return this.hasMany('Order')
    }
})

const BlacklistedToken = bookshelf.model('BlacklistedToken', {
    tableName: 'blacklisted_tokens',
})

module.exports =
{
    Figure, FigureType, Series, Collection,
    Manufacturer, Medium, Admin, Customer, CartItem,
    OrderStatus, Order, OrderedItem, ShippingType, BlacklistedToken
};