const express = require('express');
const router = express.Router();
const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Taipei');
const crypto = require('crypto');
const { Customer, BlacklistedToken } = require('../../models');
const { createNewUserForm, updateCustomerForm, changeAdminPassword } = require('../../forms');
const jwt = require('jsonwebtoken');
const { checkIfJWT } = require('../../middlewares');
const customerDataLayer = require('../../dal/customers');

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
};

const generateAccessToken = (user, secret, expiresIn) => {
    return jwt.sign({
        username: user.username,
        id: user.id,
        email: user.email
    }, secret, {
        expiresIn: expiresIn
    })
};

router.post('/register', async function (req, res) {
    let username = req.body.username.toLowerCase();
    let email = req.body.email.toLowerCase();
    let hashedPassword = getHashedPassword(req.body.password);
    let errors = {};
    let checkUsername = await Customer.where({
        username
    }).fetch({
        require: false
    });

    let checkEmail = await Customer.where({
        email
    }).fetch({
        require: false
    });

    if (checkUsername) {
        errors['username'] = "Username has already been registered"
    };
    if (checkEmail) {
        errors['email'] = "Email has already been registered"
    };

    const registerForm = createNewUserForm();
    registerForm.handle(req, {
        success: async function (form) {
            if (Object.keys(errors).length === 0 && errors.constructor === Object) {
                let { password, confirm_password, ...customerData } = form.data;
                let newCustomer = new Customer(customerData);
                newCustomer.set('password', hashedPassword);
                newCustomer.set('created_date', moment().format());
                newCustomer.set('updated_date', moment().format());
                await newCustomer.save();
                res.status(200);
                res.json({
                    message: 'new account created successfully'
                })
            } else {
                console.log(form.data);
                console.log(errors);
                res.status(400);
                res.send(JSON.stringify(errors));
            }
        },
        error: async function (form) {
            let errors = {};
            for (let key in form.fields) {
                if (form.fields[key].error) {
                    errors[key] = form.fields[key].error;
                }
            };
            if (checkUsername) {
                errors['username'] = "username already registered"
            };
            if (checkEmail) {
                errors['email'] = "email has already been registered"
            };
            res.status(400);
            res.send(JSON.stringify(errors));
        },
        empty: async function (form) {
            let errors = {};
            for (let key in form.fields) {
                if (form.fields[key].error) {
                    errors[key] = form.fields[key].error;
                }
            };
            if (checkUsername) {
                errors['username'] = "username already registered"
            };
            if (checkEmail) {
                errors['email'] = "email has already been registered"
            };
            res.status(400);
            res.send(JSON.stringify(errors));
        }
    })
})

router.post('/login', async function (req, res) {
    let customerUserOrEmail = req.body.user.toLowerCase();
    let password = getHashedPassword(req.body.password);
    let customerByUser = await Customer.where({
        username: customerUserOrEmail,
        password: password
    }).fetch({
        require: false
    });
    let customerByEmail = await Customer.where({
        email: customerUserOrEmail,
        password: password
    }).fetch({
        require: false
    });
    if (customerByUser || customerByEmail) {
        let customer = customerByEmail;
        if (customerByUser) {
            customer = customerByUser;
        }
        const customerObj = {
            username: customer.get('username'),
            email: customer.get('email'),
            id: customer.get('id')
        }
        let accessToken = generateAccessToken(customerObj, process.env.TOKEN_SECRET, '1h');
        let refreshToken = generateAccessToken(customerObj, process.env.REFRESH_TOKEN_SECRET, '7d');
        res.status(200);
        res.json({
            message: 'successfully logged in',
            first_name: customer.get('first_name'),
            last_name: customer.get('last_name'),
            accessToken,
            refreshToken
        })
    } else {
        res.status(400);
        res.json({
            message: 'incorrect credentials, please log in again'
        })
    }
});

router.get('/profile', checkIfJWT, async function (req, res) {
    let customerId = req.customer.id;
    let customerToRetrieve = await customerDataLayer.getCustomerById(customerId);
    customerToRetrieve = customerToRetrieve.toJSON();
    delete customerToRetrieve.password;
    res.status(200);
    res.send({
        customer: customerToRetrieve
    })
});

router.post('/password/update', checkIfJWT, async function (req, res) {
    let customerId = req.customer.id;
    const changePasswordForm = changeAdminPassword();
    let customer = await customerDataLayer.getCustomerById(customerId);
    let oldPassword = customer.get('password');
    let errors = {};
    changePasswordForm.handle(req, {
        success: async function (form) {
            let newPassword = getHashedPassword(form.data.password);
            if (newPassword != oldPassword) {
                customer.set('password', newPassword);
                customer.set('updated_date', moment().format())
                await customer.save();
                res.status(200);
                res.json({
                    message: "Password successfully updated"
                })
            } else {
                res.status(400);
                errors['password'] = "New password cannot be the same as old password"
                res.send(JSON.stringify(errors))
            }
        },
        error: async function (form) {
            let errors = {}
            for (let key in form.fields) {
                if (form.fields[key].error) {
                    errors[key] = form.fields[key].error;
                }
            };
            res.status(400);
            res.send(JSON.stringify(errors))
        },
        empty: async function (form) {
            let errors = {}
            for (let key in form.fields) {
                if (form.fields[key].error) {
                    errors[key] = form.fields[key].error;
                }
            };
            res.status(400);
            res.send(JSON.stringify(errors))
        }
    })
})

router.post('/refresh', async function (req, res) {
    console.log("new access token")
    let refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        res.status(401);
        res.json({
            'error': 'unable to verify you'
        })
    };
    let blacklistedToken = await BlacklistedToken.where({
        token: refreshToken
    }).fetch({
        require: false
    });
    if (blacklistedToken) {
        res.status(401);
        res.send('refresh token has expired')
    } else {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.status(403);
            } else {
                let accessToken = generateAccessToken(user, process.env.TOKEN_SECRET, '1h');
                res.status(200)
                res.send({
                    accessToken
                })
            }
        })
    }
});

router.post('/logout', async function (req, res) {
    let refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        res.status(401);
        res.json({
            'error': 'unable to verify you'
        })
    } else {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
            if (err) {
                res.status(403);
                res.json({
                    'error': 'unable to verify you'
                })
            };

            const token = new BlacklistedToken();
            token.set('token', refreshToken);
            token.set('date_created', moment().format());
            await token.save();
            res.status(200);
            res.send({
                message: 'successfully logged out'
            })

        })
    }
});


module.exports = router;