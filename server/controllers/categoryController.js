const Category = require('../models/Category');
const AppError = require('../utils/AppError');

exports.createCategory = async (req, res, next) => {
  try {
    const category = await Category.create({
      ...req.body,
      user: req.user.id
    });

    res.status(201).json({
      status: 'success',
      data: category
    });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ 
      user: req.user.id,
      parent: null 
    }).populate({
      path: 'subcategories',
      match: { user: req.user.id }
    });

    res.status(200).json({
      status: 'success',
      data: categories
    });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!category) {
      return next(new AppError('Category not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: category
    });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};