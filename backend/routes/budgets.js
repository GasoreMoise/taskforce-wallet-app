const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');
const { protect } = require('../middlewares/auth');

router.use(protect);

router.route('/')
  .get(budgetController.getBudgets)
  .post(budgetController.createBudget);

router.route('/:id')
  .get(budgetController.getBudgets)
  .patch(budgetController.updateBudget);


module.exports = router; 