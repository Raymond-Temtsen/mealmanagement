const Admin = require('../models/admin')
const bcrypt = require('bcryptjs')
const Customer = require('../models/customer');
const Meal = require('../models/meal');
const path = require("path");
const multer = require('multer');
const cloudinary = require("cloudinary");
// ===================================================   CLOUDINARY SETUP =====================================
cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret
  
  });
  // =================================================== //  CLOUDINARY SETUP =====================================
  // =========================================================== MULTER SETUP ============================
  // Set The Storage Engine
  const storage = multer.diskStorage({
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
  // Init Upload
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 10000000
    },
    fileFilter: function (req, file, cb) {
      checkFileType(file, cb);
    }
  }).single('image');
  
  // Check File Type
  function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
  
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Images Only!');
    }
  }
module.exports = {
  // ==================================================== POST meal ========================================
  postMealPost: async (req, res) => {
    upload(req, res, async err => {
      if (err) {
        console.log(err);
        req.flash('error',`${err}`)
        return res.redirect('back');
      
      }else {
        cloudinary.v2.uploader.upload(
          req.file.path,
          async (err, result) => {
            if (err) {
              console.log(err);
              req.flash('error', `something went wrong,Check your Network Connection And try again`)
              return res.redirect('back');
           
            }
            if (!result) {
              req.flash('error', `something went wrong,Check your Network Connection And try again`)
              return res.redirect('back');
            }
            const {mealName,healthPlan} = req.body;
               let newMeal = new Meal({
                 image: result.secure_url,
                 mealName,
                 healthPlan,
               });
               newMeal
                 .save()
                 .then(meal => {
                   console.log(meal)
                   req.flash("success", "Successfully Posted");
                   return res.redirect("back");
                 })
                 .catch(err => {
                   console.log(err);
                   req.flash('error', `something went wrong,Check your Network Connection And try again`)
                   return res.redirect('back');
                 
                 });
            
             
         
          }
        );
      }
    });
  },
// ========================================================== meals Plans GET=============================================
mealsPlansGet:async(req,res)=>{
    pageTitle = 'Meal Plans'
  return   res.render('admin/mealPlans', {
        layout: 'adminLayout',
        pageTitle,
    

    })
},
// =====
// ========================================================== DASHBOARD GET=============================================
    dashboardGet:async(req,res)=>{
        pageTitle = 'Admin Dashboard'
        res.render('admin/dashboard', {
            layout: 'adminLayout',
            admin: admin,
            fullName: fullName,
            pageTitle,
            totalStore: totalStore,
            totalCustomer: totalCustomer,totalProduct:totalProduct

        })
    },
// ======================================================== My ACCOUNT =====================================
    myAccountGet: (req, res) => {
        Admin.findById(req.user._id).then(admin => {
            // console.log(admin)
            const fullName = admin.firstName + ' ' + admin.lastName
            let pageTitle = fullName;
            res.render("admin/dashboard", {
                layout:'adminLayout',
                pageTitle,
                admin: admin,
                fullName
            });
        })
    },
    
}