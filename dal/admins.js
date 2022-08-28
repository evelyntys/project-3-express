const { Admin } = require('../models');

async function getAdminById(adminId) {
    return await Admin.where({
        id: adminId
    }).fetch({
        required: true
    });
};

async function getAdminByUserName(username){
    return await Admin.where({
        username: username
    }).fetch({
        require: false
    });
};

async function getAdminByEmail(email){
    return await Admin.where({
        email: email
    }).fetch({
        require: false
    })
};

async function getAllAdmins(){
    return await Admin.fetchAll();
}

module.exports = { getAdminById, getAdminByUserName, getAdminByEmail,
getAllAdmins }