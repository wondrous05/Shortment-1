const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  propertyName: {
    type: String,
    required: true
  },
  HouseAdress: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  numberOfBeds: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Host',
    required: true
  },
  images: {
    type: String,
    default: ""
  },
  status: {
    type: String,
    enum: ['declined', 'approved', 'pending'],
    default: "pending"
  },
  securityFee: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Property = mongoose.model('Property', propertySchema);
module.exports = Property
