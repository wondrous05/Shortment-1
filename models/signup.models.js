const mongoose = require("mongoose");

const signupSchema = new mongoose.Schema({
  profileName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmPassword: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  role: { type: String, enum: ['guest', 'host', 'admin'], default: 'guest' },
  phoneNumber: {
    type: String,
    required: true
  },
  recapcha: {
    type: String,
    required: true
  },
  newPassword: {
    type: String
  },
  profilePicture: {
    type: String,
    default: ""
  }
}, {
  timestamps: true,
});

const signupModel = mongoose.model("Signup", signupSchema)
module.exports = signupModel