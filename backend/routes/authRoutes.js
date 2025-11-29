// routes/authRoutes.js
const express = require('express');
const { loginAdmin } = require('../controllers/authController');

const router = express.Router();

// Login Route
router.post('/login', loginAdmin);

module.exports = router;