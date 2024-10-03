const express = require('express')
const router = express.Router();
const {search, fetchProperties, uploadvalidId, history, booking } = require('../controllers/guest.controllers')
const {authenticate, guestMiddleware} = require('../middleware/auth')



router.post('/guest/upload',authenticate, guestMiddleware, uploadvalidId)
router.post('/guest/search,',authenticate, guestMiddleware, search)
router.post('/guest/fetch',authenticate, guestMiddleware, fetchProperties)
router.post('/guest/history',authenticate, guestMiddleware, history)
router.post('/guest/booking',authenticate, guestMiddleware, booking)







module.exports = router;