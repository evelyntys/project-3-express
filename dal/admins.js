const { Admin } = require('../models');

async function getAdminById(adminId) {
    return await Admin.where({
        id: adminId
    }).fetch({
        required: true
    });
};

module.exports = { getAdminById }