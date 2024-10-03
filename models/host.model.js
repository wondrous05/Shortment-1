const mongoose = require('mongoose');

const hostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // Assuming you have a User model for basic user info
    required: true
  },
  propertyListings: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Apartment'
  }],
  totalEarnings: {
    type: Number,
    default: 0
  },
});

const hostModel = mongoose.model('Host', hostSchema);
module.exports = hostModel

