const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { Customer } = require('../../models');
const { createNewUserForm } = require('../../forms');

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

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
                let {password, confirm_password, ...customerData} = form.data;
                let newCustomer = new Customer(customerData);
                newCustomer.set('password', hashedPassword);
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
    console.log(password);
    let customerByUser = await Customer.where({
        username: customerUserOrEmail,
        password: getHashedPassword(req.body.password)
    }).fetch({
        require: false
    });
    console.log(customerByUser);
    let customerByEmail = await Customer.where({
        email: customerUserOrEmail,
        password: getHashedPassword(req.body.password)
    }).fetch({
        require: false
    });
    console.log(customerByEmail);
    if (customerByUser || customerByEmail) {
        let customer = customerByEmail;
        if (customerByUser) {
            customer = customerByUser;
        }
        res.status(200);
        res.json({
            message: 'successfully logged in',
            customer
        })
    } else {
        res.status(400);
        res.json({
            message: 'incorrect credentials, please log in again'
        })
    }
})

module.exports = router;