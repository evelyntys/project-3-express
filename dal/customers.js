const { Customer } = require('../models');

async function getCustomerById(id) {
    return await Customer.where({
        id: id
    }).fetch({
        require: true
    })
};

async function getAllCustomers(){
    return await Customer.fetchAll()
}

module.exports = { getCustomerById, getAllCustomers };