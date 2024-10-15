const express = require("express")
const router = express.Router()
const {authenticate} = require("../middleware/auth")
const upload = require("../utils/multer")


const {
  userSignup,
  userLogin,
  forgotPassword,
  resetPassword,
  uploadProfilePicture,
  findAllUsers
} = require("../controllers/signup.controllers")


router.post("/signup", userSignup)
router.post("/signin", userLogin )
router.post("/forgotpassword", forgotPassword)
router.post('/reset-password',g resetPassword);
router.post('/profile-picture', upload.single("profilePicture"), uploadProfilePicture);
router.get('/fetchusers',findAllUsers )

module.exports = router
