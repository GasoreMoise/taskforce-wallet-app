const Account = require('../models/Account');
const AppError = require('../utils/AppError');

exports.createAccount = async (req, res, next) => {
  try {
    const account = await Account.create({
      ...req.body,
      user: req.user.id
    });

    res.status(201).json({
      status: 'success',
      data: account
    });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

exports.getAccounts = async (req, res, next) => {
  try {
    const accounts = await Account.find({ user: req.user.id });
    
    res.status(200).json({
      status: 'success',
      data: accounts
    });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

exports.getAccount = async (req, res, next) => {
  try {
    const account = await Account.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!account) {
      return next(new AppError('Account not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: account
    });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

exports.updateAccount = async (req, res, next) => {
  try {
    const account = await Account.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!account) {
      return next(new AppError('Account not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: account
    });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

exports.deleteAccount = async (req, res, next) => {
  try {
    const account = await Account.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!account) {
      return next(new AppError('Account not found', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
}; 