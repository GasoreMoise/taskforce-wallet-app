const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const { protect } = require('../middlewares/auth');
const { validateAccount } = require('../middlewares/validate');

// Protect all routes after this middleware
router.use(protect);

router.route('/')
  .get(accountController.getAccounts)
  .post(validateAccount, accountController.createAccount);

router.route('/:id')
  .get(accountController.getAccount)
  .patch(validateAccount, accountController.updateAccount)
  .delete(accountController.deleteAccount);



module.exports = router; 