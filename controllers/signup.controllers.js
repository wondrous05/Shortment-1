const signupModel = require("../models/signup.models")
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt');
const mailer = require("../nodemailer/mailer")
const validator = require("validator")
const crypto = require("crypto")
const axios = require("axios")
const cloudinary = require("../utils/cloudinary")

const userSignup =  async (req, res) => {
  const {profileName, email, password, confirmPassword, phoneNumber, recaptcha} = req.body
  try { 
    // if (!recaptcha) {
    //   return res.status(400).json({ message: "🔥 Please complete the reCAPTCHA" });
    // }

    // const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.REP_SECRET_KEY}&response=${recaptcha}`);

    // if (!response.data.success) {
    //   return res.status(400).json({ message: "🔥 reCAPTCHA verification failed" });
    // }

    if(!profileName && !email && !password && !phoneNumber && !confirmPassword){
      return res.status(400).json({message: " 🔥 PLEASE FILL THIS FIELD"})
    }
    if (!validator.isLength(password, { min: 8 })) {
      return res.status(400).json({ message: "🔥 PASSWORD MUST BE AT LEAST 8 CHARACTERS LONG" });
    }
    const userExist = await signupModel.findOne({email})
    if(userExist){
      return res.status(409).json({success: false, message: "🔥 USER ALREADY EXIST"})
    }
    const hashPassword = await bcrypt.hash(password, 10)
    const newUser = await signupModel.create({
      profileName,
      email,
      password: hashPassword,
      phoneNumber,
      confirmPassword
    })
    await mailer.sendMail({
      from: 'Shortment', 
      to: newUser.email,
      subject: 'Welcome to Shortment',
      text: `Hello ${newUser.profileName},\n\nThank you for registering with us!\n\nBest regards,\nShortment`,
      html: `<p>Dear <strong>${newUser.profileName}</strong>,</p>
      <p>A warm welcome to Shortment!</p>
        <p>We're thrilled to have you on board! Thank you for choosing us.</p>
        <p>Your account is now active, and you can start using and benefiting from our services right away. If you need any help getting started, our support team is here to assist you.</p>
        <p>Best regards,<br>Shortment teams</p>`
    });
    return res.status(201).json({messsge:`USER  REGISTERED SUCCESSSFULLY`, data: newUser})
  
  } catch (error) {
    console.log(error.message);
    res.status(500).json(error)
  }
}

const userLogin = async (req, res) => {
  const {email, password} = req.body
  try {
    if (!email && !password) {
      return res.status(400).json("🔥 FILL THIS FIELD")
    }
    const user = await signupModel.findOne({email})
    if (!user){
      return res.status(404).json("🔥 USER DOES NOT EXIST")
    }
    const comparedPassword = await bcrypt.compare(password, user.password)
    if(!comparedPassword){
      return res.status(404).json("🔥 INVALID PASSWORD")
    }
    const adminPayload = {
      id: user._id,
      role: user.role
    };
    const token = jwt.sign(adminPayload, process.env.SECRET_KEY, { expiresIn: "10mins" });

    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    const dataInfo = {
      email: user.email,
      userId: user._id,
      token: token
    };

    return res.status(200).json({ message: "LOGIN SUCCESSFULL.", data: dataInfo });
    
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.status(400).json({ message: "🔥 PLEASE PROVIDE AN EMAIL ADDRESS" });
    }

    const user = await signupModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "🔥 USER DOES NOT EXIST" });
    }

    const otp = crypto.randomBytes(3).toString('hex').toUpperCase();
    const otpExpiry = Date.now() + 3 * 60 * 1000; 

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    await mailer.sendMail({
      from: 'Shortment',
      to: user.email,
      subject: 'Reset Your Password',
      text: `Hello ${user.profileName},\n\nYour OTP for resetting your password is ${otp}.\n\nBest regards,\nShortment`,
      html: `<p>Dear <strong>${user.profileName}</strong>,</p>
             <p>You requested to reset your password. Please use the OTP below to proceed:</p>
             <h2>${otp}</h2>
             <p>This OTP is valid for 3 minutes.</p>
             <p>If you did not request this, please ignore this email.</p>
             <p>Best regards,<br>Shortment teams</p>`
    });

    return res.status(200).json({ message: "🔥 RESET PASSWORD EMAIL SENT SUCCESSFULLY" });

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "🔥 INTERNAL SERVER ERROR", error: error.message });
  }
};
const resetPassword = async (req, res) => {
  const { otp, newPassword } = req.body;
  try {
    if (!otp || !newPassword) {
      return res.status(400).json({ message: "🔥 Please provide the OTP and new password." });
    }
    const user = await signupModel.findOne({ otp });

    if (!user) {
      return res.status(400).json({ message: "🔥 Invalid OTP." });
    }

    if (Date.now() > user.otpExpiry) {
      return res.status(400).json({ message: "🔥 OTP has expired." });
    }


    if (!validator.isLength(newPassword, { min: 8 })) {
      return res.status(400).json({ message: "🔥 PASSWORD MUST BE AT LEAST 8 CHARACTERS LONG" });
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashPassword;

    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    return res.status(200).json({ message: "🔥 Password reset successfully." });

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "🔥 INTERNAL SERVER ERROR", error: error.message });
  }
};


const uploadProfilePicture = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'profile_pictures',  
      public_id: `profile_${req.user._id}`,
    });

    await User.findByIdAndUpdate(req.user._id, { profilePicture: result.secure_url });

    res.status(200).json({ message: 'Profile picture uploaded successfully!', profilePicture: result.secure_url });
  } catch (error) {
    res.status(500).json({ error: 'Error uploading profile picture' });
  }
};

module.exports = {
  userSignup,
  userLogin,
  forgotPassword,
  resetPassword,
  uploadProfilePicture
}