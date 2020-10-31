const Customer = require('../models/customer')
//======================================================= controller properties ==================================
module.exports = {


// ========================================LOGIN ROUTE ===========================================
    loginPost:(req,res)=>{
        console.log(req.body)
    },
// ======================================== RENDER HOMEPAGE ===========================================
    index:(req,res)=>{
        const pageTitle = 'Meal Planner'
        res.render('default/index', {
            pageTitle: pageTitle,
           
        })
    
      
    },
    // =====================================================  dashboardGet (myaccount)  ===============================
    myAccountGet: async(req,res)=>{
        if(!req.user)return res.redirect('/')
        if (req.user.userType === 'customer') {

                 return res.redirect('/customer/profile')


        } else if (req.user.userType === 'admin') {

                return res.redirect('/admin/profile')


        }
        else {
        req.flash('error','None User ************************')
        return res.redirect('back')
    }
    },
    // ================================================= home logout ===============================
    logoutGet:(req,res)=>{
        req.logout();
        req.flash("success", "successfully logged out");
        res.redirect("/");
    },
    // ================================================================== usertype check post ==========================
    userTypeCheckPost:(req,res)=>{
        console.log(req.body)
        const userType = req.body.userType;
        if(userType === 'Store'){
            return res.redirect('/store/forgotPassword')
        }
        else if(userType === 'Customer'){
            return res.redirect('/customer/forgotPassword')

        }
        else if(userType ==='Admin'){
            return res.redirect('/admin/forgotPassword')
        }
        else{
            req.flash('error', 'No Such User Type')
            return res.redirect('back')
        }
    },

   
}