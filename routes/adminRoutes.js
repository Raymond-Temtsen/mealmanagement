const express = require('express')
const router = express.Router();
const adminController = require('../controllers/adminController')
const { isUserAuthenticatedAdmin } = require("../config/customFunctions")
router.route('/postMeal').post(isUserAuthenticatedAdmin,adminController.postMealPost)
// ========================================================== meal plans GET=============================================
router.route('/mealPlans').get(isUserAuthenticatedAdmin,adminController.mealsPlansGet)
// ========================================================== DASHBOARD GET=============================================
router.route('/dashboard').get(isUserAuthenticatedAdmin,adminController.dashboardGet)
// ========================================================== PROFILE GET ==============================================
router.route('/profile').get(isUserAuthenticatedAdmin,adminController.myAccountGet)

module.exports = router;