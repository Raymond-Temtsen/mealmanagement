const Customer = require('../models/customer')
const bcrypt = require('bcryptjs');
const Meal = require('../models/meal')

module.exports = { 
// ======================================================== MY MEALS GET =====================================
myMealGet:(req,res)=>{
    Customer.findById(req.user._id).then(customer => {
        // console.log(customer)
        let pageTitle = "My Meals"
        res.render("customer/myMeals", {pageTitle, customer,layout:'customerLayout' });
    })
},
// ======================================================== My ACCOUNT =====================================
myAccountGet:(req,res)=>{
         Customer.findById(req.user._id).then(customer => {
                // console.log(customer)
                let pageTitle = customer.fullName;
                res.render("customer/dashboard", {pageTitle, customer,layout:'customerLayout' });
            })
},
// ======================================================== REGISTRATION =====================================
registerPost: async (req, res) => {
    console.log('INCOMING DATA:::', req.body)
    const {email,password,password2,age,healthPlan,fullName} = req.body
    Customer.findOne({
        email
    }, (err, customer) => {
    
        if (customer) {
            req.flash('error','Email Already Exists')
             return res.redirect('/')
        } else if (password !== password2) {
            req.flash('error','Passwords do not match')
            return res.redirect('/')
        } else {
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, salt,async (err, hash) => {
                    if (err) {
                        console.log(err)
                    }
                    const password = hash;
                    let newCustomer = new Customer({
                        fullName,
                        email,
                        password,
                        healthPlan,
                        age,
                        userType: 'customer',
                    })
                        try{
                            Meal.find({healthPlan}).then(meals =>{
                            let randomValue = meals[Math.floor(Math.random() * meals.length)];
                            console.log(randomValue)
                            newCustomer.meal.mon =  meals[Math.floor(Math.random() * meals.length)] || {};
                            newCustomer.meal.tue =  meals[Math.floor(Math.random() * meals.length)]|| {};
                            newCustomer.meal.wed =  meals[Math.floor(Math.random() * meals.length)]|| {};
                            newCustomer.meal.thur = meals[Math.floor(Math.random() * meals.length)]|| {};
                            newCustomer.meal.fri =  meals[Math.floor(Math.random() * meals.length)]|| {};
                            newCustomer.meal.sat =  meals[Math.floor(Math.random() * meals.length)]|| {};
                            newCustomer.meal.sun =  meals[Math.floor(Math.random() * meals.length)]|| {};
                             newCustomer.save().then(customer => {
                            console.log('new customer saved',customer)
                            req.flash('success', 'Registration successful, Kindly Login')
                            return res.redirect('/')
                        })
                            }).catch(err =>{
                                console.log(err)
                                req.flash('error', 'Something went wrong, Please try Again')
                                return res.redirect('back')  
                            })
                           
                    }catch(err){
                        console.log(err)
                        next(err)
                        req.flash('error', 'Something went wrong, Please try Again')
                        return res.redirect('back')
                    }
                    
                })
            })
        }
    })

},
}