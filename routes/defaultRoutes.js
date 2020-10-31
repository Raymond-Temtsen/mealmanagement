const express = require('express')
const router = express.Router();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require('bcryptjs')
const defaultController = require('../controllers/defaultController')
const Customer = require('../models/customer')
const Admin = require('../models/admin') 
router.route('/userTypeCheck').post(defaultController.userTypeCheckPost)
// // =======================================================my ACCOUNT ===============================
router.route('/myAccount').get(defaultController.myAccountGet)
// ===================================================  HOME PAGE LOGOUT ==============================
router.route('/logout').get(defaultController.logoutGet)
// ================================================= RENDER HOME PAGE + SEARCH BOX QUERY ==============================
router.route('/').get(defaultController.index)
// // =======================================================CONFIGURE PASSPORT ===============================
// Defining Local Strategy
passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
}, (req, email, password, done) => {
    Customer.findOne({
        email: email.trim()
    }).then(user => {
        if (!user) {
            Admin.findOne({
                email: email.trim()
            }).then(user => {
                if (!user) {
                    return done(null, false, req.flash('error', 'User not found with this email.'));
                
                }
                if (!user.active) {
                    return done(null, false, req.flash('error', 'Please go to your mail and active your account first'));
                }

                bcrypt.compare(password.trim(), user.password, (err, passwordMatched) => {
                    if (err) {
                        return err;
                    }

                    if (!passwordMatched) {
                        return done(null, false, req.flash('error', 'Invalid Password, Please try again'));
                    }

                    return done(null, user, req.flash('success', 'Login Successful'));
                });
            });
        }
        if (!user.active) {
            return done(null, false, req.flash('error', 'Please go to your mail and active your account first'));
        }

        bcrypt.compare(password.trim(), user.password, (err, passwordMatched) => {
            if (err) {
                return err;
            }

            if (!passwordMatched) {
                return done(null, false, req.flash('error', 'Invalid Password, Please try again'));
            }

            return done(null, user, req.flash('success', 'Login Successful'));
        });
    });
}));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    Customer.findById(id, function (err, user) {
        if (!user) {
            Admin.findById(id, function (err, user) {
              
                    done(err, user);

            });
        } else {
            done(err, user);
        }
    });

});
router.route('/login')
    .post(passport.authenticate('local', {
        successRedirect: '/myAccount',
        failureRedirect: '/',
        failureFlash: true,
        successFlash: true,
        session: true
    }), defaultController.loginPost);


module.exports = router;