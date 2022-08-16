const express = require('express');
const router = express.Router();
const adminDataLayer = require('../dal/admins');
const { changeAdminPassword, bootstrapField } = require('../forms');
const crypto = require('crypto');
const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
};

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