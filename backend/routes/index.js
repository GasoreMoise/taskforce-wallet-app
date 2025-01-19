const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const authController = require('../controllers/authController');
const transactionController = require('../controllers/transactionController');
const reportController = require('../controllers/reportController');

// Auth routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

// Transaction routes
router.use('/transactions', protect);
router.post('/transactions', transactionController.createTransaction);
router.get('/transactions', transactionController.getTransactions);

// Report routes
router.use('/reports', protect);
router.get('/reports/summary', reportController.getSummary);

module.exports = router; 