const Budget = require('../models/Budgets');
const AppError = require('../utils/AppError');

exports.createBudget = async (req, res, next) => {
  try {
    const budget = await Budget.create({
      ...req.body,
      user: req.user.id
    });

    res.status(201).json({
      status: 'success',
      data: budget
    });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

exports.getBudgets = async (req, res, next) => {
  try {
    const budgets = await Budget.find({ user: req.user.id })
      .populate('category')
      .sort('-startDate');

    res.status(200).json({
      status: 'success',
      data: budgets
    });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

exports.updateBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!budget) {
      return next(new AppError('Budget not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: budget
    });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
}; 