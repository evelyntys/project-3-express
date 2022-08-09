const express = require('express');
const { createLoginForm, bootstrapField } = require('../forms');
const { Admin } = require('../models');
const router = express.Router();
const crypto = require('crypto');

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

router.get('/', function (req, res) {
    const loginForm = createLoginForm();
    res.render('index', {
        form: loginForm.toHTML(bootstrapField)
    })
});

router.post('/', async function (req, res) {
    const loginForm = createLoginForm();
    loginForm.handle(req, {
        success: async function (form) {
            let admin = await Admin.where({
                email: form.data.email,
                password: getHashedPassword(form.data.password)
            }).fetch({
                require: false
            })
            if (!admin) {
                req.flash('error_messages', 'sorry, it seems that you have entered the wrong email/password');
                res.redirect('/')
            }
            else {
                req.session.admin = {
                    id: admin.get('id'),
                    username: admin.get('username'),
                    email: admin.get('email'),
                    first_name: admin.get('first_name')
                }
                req.flash('success_messages', 'welcome back, ' + admin.get('first_name'));
                res.redirect('/products');
            }
        },
        error: function (form) {
            req.flash('error_messages', 'sorry, it seems that there are some difficulty logging you in. please try again.');
            res.render('index', {
                form: form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/logout', function(req,res){
    req.session.admin = null;
    req.flash('success_messages', 'successful logout');
    res.redirect('/')
})

module.exports = router;