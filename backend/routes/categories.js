const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController.js');
const { protect } = require('../middlewares/auth');

router.use(protect);

router.route('/')
  .get(categoryController.getCategories)
  .post(categoryController.createCategory);

router.route('/:id')
  .get(categoryController.getCategories)
  .patch(categoryController.updateCategory)


module.exports = router; 