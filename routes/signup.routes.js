const express = require("express")
const router = express.Router()
const {authenticate} = require("../middleware/auth")
const upload = require("../utils/multer")


const {
  userSignup,
  userLogin,
  forgotPassword,
  resetPassword,
  uploadProfilePicture
} = require("../controllers/signup.controllers")


router.post("/signup", userSignup)
router.post("/signin", userLogin )
router.post("/forgotpassword", authenticate, forgotPassword)
router.post('/reset-password', authenticate, resetPassword);
router.post('/profile-picture', upload.single("profilePicture"), uploadProfilePicture);

module.exports = router
