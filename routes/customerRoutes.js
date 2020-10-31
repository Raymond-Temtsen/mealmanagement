const express = require('express')
const router = express.Router();
const customerController = require('../controllers/customerController')
const { isUserAuthenticatedCustomer } = require("../config/customFunctions");
// ======================================================== MY MEALS GET =====================================
router.route('/myMeal').get(isUserAuthenticatedCustomer,customerController.myMealGet)
// ================================================== REGISTER POST ===================================
router.route("/register").post(customerController.registerPost)
// ================================================== My Account GEt=====================================
router.route('/profile').get(isUserAuthenticatedCustomer,customerController.myAccountGet);


module.exports = router;