const express = require('express');
const router = express.Router();
const adminDataLayer = require('../dal/admins');
const customerDataLayer = require('../dal/customers');
const { changeAdminPassword, bootstrapField, CreateNewAdminForm } = require('../forms');
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
                req.flash('success_messages', 'password has been successfully updated');
                res.redirect('/admins/profile')
            } else {
                req.flash('error_messages', 'new password cannot be the same as old password')
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
    req.flash('success_messages', 'successful logout');
    res.redirect('/')
});

module.exports = router;