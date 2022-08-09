const CheckIfAdmin = function (req, res, next) {
    if (req.session.admin) {
        next();
    } else {
        req.flash('error_messages', 'please login to view this page');
        res.redirect('/');
    }
}

module.exports = { CheckIfAdmin }