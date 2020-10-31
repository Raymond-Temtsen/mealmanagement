const mongoose = require('mongoose');
const { Schema } = mongoose;

const mealSchema = new Schema({
  mealName: {
    type: String,
    required: true
  },
  
  image: {
    type: String,
    required: true
  },
  healthPlan: {
    type: String,
    required: true
  },
    date: {
      type: Date,
      default: Date.now
    },
    
});

const Meal = mongoose.model('Meal', mealSchema);

module.exports = Meal;


