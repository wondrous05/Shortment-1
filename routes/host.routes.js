const express = require('express');
const router = express.Router();
const { createProperty } = require('../controllers/host.controllers');  
const { authenticate, hostMiddleware } = require('../middlewares/auth');

router.post('/properties', authenticate, hostMiddleware, createProperty);

module.exports = router;