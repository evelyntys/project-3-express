const express = require('express');
const router = express.Router();
const adminDataLayer = require('../dal/admins');
const customerDataLayer = require('../dal/customers');
const { changeAdminPassword, bootstrapField, CreateNewAdminForm, createNewUserForm, updateCustomerForm } = require('../forms');
const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Taipei');
const crypto = require('crypto');
const { Admin } = require('../models');
const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
};

router.get('/register', async function (req, res) {
    const form = CreateNewAdminForm();
    res.render('admins/register', {
        form: form.toHTML(bootstrapField)
    })
});

router.post('/register', async function (req, res) {
    const form = CreateNewAdminForm();
    form.handle(req, {
        success: async function (form) {
            let checkExistingUserName = await adminDataLayer.getAdminByUserName(form.data.username);
            let checkExistingEmail = await adminDataLayer.getAdminByEmail(form.data.email);
            if (checkExistingEmail && checkExistingUserName) {
                res.render('admins/register', {
                    form: form.toHTML(bootstrapField),
                    errorMsg: 'already have an existing admin with the same username and email'
                })
            }
            else if (checkExistingUserName) {
                res.render('admins/register', {
                    form: form.toHTML(bootstrapField),
                    errorMsg: 'already have an existing admin with the same username'
                })
            }
            else if (checkExistingEmail) {
                res.render('admins/register', {
                    form: form.toHTML(bootstrapField),
                    errorMsg: 'already have an existing admin with same email'
                })
            }
            if (!checkExistingUserName && !checkExistingEmail) {
                let newAdmin = new Admin();
                let { password, confirm_password, ...adminData } = form.data;
                newAdmin.set(adminData);
                newAdmin.set('created_date', moment().format());
                newAdmin.set('updated_date', moment().format());
                hashedPW = getHashedPassword(password);
                newAdmin.set('password', hashedPW);
                await newAdmin.save();
                req.flash('success_messages', 'new admin successfully created')
                res.redirect('/admins/register');
            }
        },
        error: async function (form) {
            res.render('admins/register', {
                form: form.toHTML(bootstrapField)
            })
        },
        empty: async function (form) {
            res.render('admins/register', {
                form: form.toHTML(bootstrapField)
            })
        }
    })
});

router.get('/users', async function (req, res) {
    let allAdmins = await adminDataLayer.getAllAdmins();
    let allCustomers = await customerDataLayer.getAllCustomers();
    res.render('admins/users', {
        allAdmins: allAdmins.toJSON(),
        allCustomers: allCustomers.toJSON()
    })
});

router.get('/customer/:customerId/update', async function (req, res) {
    const customerForm = updateCustomerForm();
    let customer = await customerDataLayer.getCustomerById(req.params.customerId);
    customerForm.fields.username.value = customer.get('username');
    customerForm.fields.first_name.value = customer.get('first_name');
    customerForm.fields.last_name.value = customer.get('last_name');
    customerForm.fields.email.value = customer.get('email');
    customerForm.fields.contact_number.value = customer.get('contact_number');
    customerForm.fields.block_street.value = customer.get('block_street');
    customerForm.fields.unit.value = customer.get('unit');
    customerForm.fields.postal.value = customer.get('postal');
    res.render('admins/update_customer', {
        form: customerForm.toHTML(bootstrapField),
        customer: customer.toJSON()
    })
});

router.post('/customer/:customerId/update', async function (req, res) {
    const customerForm = updateCustomerForm();
    let customer = await customerDataLayer.getCustomerById(req.params.customerId);
    customerForm.handle(req, {
        success: async function (form) {
            console.log(form.data)
            let { password, confirm_password, ...customerData } = form.data;
            customer.set(customerData);
            customer.set('updated_date', moment().format());
            await customer.save();
            req.flash('success_messages', `Customer #${customer.get('id')} has been updated successfully`);
            res.redirect('/admins/users');
        },
        error: async function (form) {
            res.render('admins/update_customer', {
                form: form.toHTML(bootstrapField),
                customer: customer.toJSON()
            })
        },
        empty: async function (form) {
            res.render('admins/update_customer', {
                form: form.toHTML(bootstrapField),
                customer: customer.toJSON()
            })
        }
    })
})

router.get('/profile', async function (req, res) {
    let adminId = req.session.admin.id;
    let admin = await adminDataLayer.getAdminById(adminId);
    const changeAdminPasswordForm = changeAdminPassword();
    res.render('admins/profile', {
        form: changeAdminPasswordForm.toHTML(bootstrapField),
        admin: admin.toJSON()
    });
});

router.post('/profile', async function (req, res) {
    let adminId = req.session.admin.id;
    const changeAdminPasswordForm = changeAdminPassword();
    let admin = await adminDataLayer.getAdminById(adminId);
    let oldPassword = admin.toJSON().password;
    changeAdminPasswordForm.handle(req, {
        success: async function (form) {
            let newPassword = getHashedPassword(form.data.password);
            if (newPassword != oldPassword) {
                admin.set('password', newPassword);
                admin.set('updated_date', moment().format())
                await admin.save();
                req.flash('success_messages', 'Password has been successfully updated');
                res.redirect('/admins/profile')
            } else {
                req.flash('error_messages', 'New password cannot be the same as old password')
                res.redirect('/admins/profile')
            }
        },
        error: async function (form) {
            res.render('admins/profile', {
                form: form.toHTML(bootstrapField),
                admin: admin.toJSON()
            })
        }
    })
})

router.get('/logout', function (req, res) {
    req.session.admin = null;
    req.flash('success_messages', 'Logged out successfully');
    res.redirect('/')
});

module.exports = router;