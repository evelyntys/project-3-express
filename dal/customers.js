const { Customer } = require('../models');

async function getCustomerById(id) {
    return await Customer.where({
        id: id
    }).fetch({
        require: true
    })
}

module.exports = { getCustomerById };