const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  guestName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Guest',
    required: true
  },
  hostName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Host',
    required: true
  },
  hostNumber: {
    type: String,
    required: true
  },
  propertyName: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['checkin', 'checkout']
  },
  checkInDate: {
    type: Date,
    required: true
  },
  checkOutDate: {
    type: Date,
    required: true
  },
  price: {
    type: mongoose.Decimal128,
    required: true
  },
  bookingDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booking', bookingSchema);
