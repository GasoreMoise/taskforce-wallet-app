const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { protect } = require('../middlewares/auth');

router.use(protect);

router.route('/')
  .get(transactionController.getTransactions)
  .post(transactionController.createTransaction);

router.route('/:id')
  .get(transactionController.getTransactions);


module.exports = router; 