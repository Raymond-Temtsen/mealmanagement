const Customer = require('../models/customer');
module.exports = {

    isUserAuthenticatedAdmin: (req, res, next) => {
        if (req.isAuthenticated() && req.user.userType === 'admin') {
            next();
        }
        else {
            req.flash('error', 'You Have To Login First')
            res.redirect('back');
        }
    },
    
    isUserAuthenticatedCustomer: (req, res, next) => {
        if (req.isAuthenticated() && req.user.userType === 'customer') {
            next();
        }
        else {
            req.flash('error', 'You Have To Login First')
            res.redirect('back');
        }
    },



};
