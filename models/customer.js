const mongoose = require('mongoose');
const {
    Schema
} = mongoose;

const customerSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    
    email: {
        type: String,
        required: true
    },
    age: {
        type: String,
        required: true
    },
    healthPlan: {
        type: String,
    },
    active: {
        type: Boolean,
        default: true
    },
    meal:{
        mon:{
           type:Object 
        },
        tue:{
            type:Object 
         },
         wed:{
            type:Object 
         },
         thur:{
            type:Object 
         },
         fri:{
            type:Object 
         },
         sat:{
            type:Object 
         },
         sun:{
            type:Object 
         },
    },
    userType:{
    type:String,
    required: true
    },
    password: String,
    secretToken: String,
          resetPasswordToken: String,
          resetPasswordExpires: Date
});

const Customer = mongoose.model('customer', customerSchema);

module.exports = Customer;


