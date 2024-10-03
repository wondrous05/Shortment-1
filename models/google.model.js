const mongoose = require("mongoose")
const userSchema = new mongoose.Schema(
  
  {
  googleId: String,
  displayName: String,
  photo: String,
  email: String,
  role: String, 
}

);

const User = mongoose.model("User", userSchema);

module.exports = User