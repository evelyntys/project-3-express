const jwt = require('jsonwebtoken');

const CheckIfAdmin = function (req, res, next) {
    if (req.session.admin) {
        next();
    } else {
        req.flash('error_messages', 'Please login to view this page.');
        res.redirect('/');
    }
};

const checkIfJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
            if (err) {
                res.status(403);
                res.send('Your session has expired, please try again.');
            }
            else {
                req.customer = user;
                next();
            }
        })
    } else {
        res.status(404);
        res.send('Please ensure that you are logged in.');
    }
}

module.exports = { CheckIfAdmin, checkIfJWT }