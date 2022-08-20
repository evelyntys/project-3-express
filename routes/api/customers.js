const express = require('express');
const router = express.Router();
const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Taipei');
const crypto = require('crypto');
const { Customer, BlacklistedToken } = require('../../models');
const { createNewUserForm } = require('../../forms');
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
    let username = req.body.username;
    let email = req.body.email;
    let hashedPassword = getHashedPassword(req.body.password);
    // let first_name = req.body.first_name;
    // let last_name = req.body.last_name;
    // let contact_number = req.body.contact_number;
    // let street = req.body.street;
    // let unit = req.body.unit;
    // let postal = req.body.postal;
    let errorCheck = [];
    // let validation = [];
    // check if user exists
    let checkUsername = await Customer.where({
        username
    }).fetch({
        require: false
    });
    if (checkUsername) {
        errorCheck.push({
            username: 'username already exists'
        })
    };
    let checkEmail = await Customer.where({
        email
    }).fetch({
        require: false
    });
    if (checkEmail) {
        errorCheck.push({
            email: 'email already registered'
        })
    };
    if (errorCheck.length == 0) {
        const registerForm = createNewUserForm();
        registerForm.handle(req, {
            success: async function (form) {
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
            },
            error: async function (form) {
                let errors = {};
                for (let key in form.fields) {
                    if (form.fields[key].error) {
                        errors[key] = form.fields[key].error;
                    }
                }
                res.status(400);
                res.send(JSON.stringify(errors));
            }
        })
    }
    else {
        res.status(400);
        res.json(
            errorCheck
        )
    }
    // if (errorCheck.length == 0) {
    //     let newCustomer = new Customer();
    //     newCustomer.set({
    //         username,
    //         email,
    //         password,
    //         first_name,
    //         last_name,
    //         contact_number,
    //         street,
    //         unit,
    //         postal
    //     });
    //     await newCustomer.save();
    //     res.status(200);
    //     res.json({
    //         message: 'new account created successfully'
    //     })
    // }
    // else {
    //     res.status(400);
    //     res.json(
    //         errorCheck
    //     )
    // }
})

router.post('/login', async function (req, res) {
    let customerUserOrEmail = req.body.user;
    let password = getHashedPassword(req.body.password);
    let customerByUser = await Customer.where({
        username: customerUserOrEmail,
        password: password
    }).fetch({
        require: false
    });
    console.log(customerByUser);
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
        let accessToken = generateAccessToken(customerObj, process.env.TOKEN_SECRET, '15m');
        let refreshToken = generateAccessToken(customerObj, process.env.REFRESH_TOKEN_SECRET, '7d');
        res.status(200);
        res.json({
            message: 'successfully logged in',
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
    const customer = req.customer;
    res.send(customer);
});

router.post('/refresh', async function (req, res) {
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
                let accessToken = generateAccessToken(user, process.env.TOKEN_SECRET, '15m');
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

router.get('/:customerId/details', checkIfJWT, async function(req,res){
    let customerId = parseInt(req.params.customerId);
    if (customerId === req.customer.id){
        let customerToRetrieve = await customerDataLayer.getCustomerById(customerId);
        customerToRetrieve = customerToRetrieve.toJSON();
        delete customerToRetrieve.password;
    res.status(200);
    res.send({
        customer: customerToRetrieve
    })
} else {
    res.status(400);
    res.send({
        error: "you are trying to access someone else's data :("
    })
}
})

module.exports = router;