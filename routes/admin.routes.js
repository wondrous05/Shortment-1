const express = require('express');
const router = express.Router();
const { getAllGuests, getAllHosts, adminLogin, getAllProperties, approveProperty, rejectProperty, getAllBookings } = require('../controllers/admin.controllers');
const {authenticate, adminMiddleware} = require("../middleware/auth")

router.post('/admin/login',  adminLogin)
router.get('/admin/guest', authenticate, adminMiddleware, getAllGuests); 
router.get('/admin/hosts', authenticate, adminMiddleware, getAllHosts); 
router.get('/list/properties', authenticate, adminMiddleware, getAllProperties); 
router.post('/properties/:id/approve',authenticate, adminMiddleware, approveProperty);
router.post('/properties/:id/reject',authenticate, adminMiddleware, rejectProperty);
router.get("/admin/bookings", authenticate, adminMiddleware, getAllBookings)

module.exports = router;
