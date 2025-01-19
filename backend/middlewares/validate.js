const AppError = require('../utils/AppError');
const validators = require('../utils/validators');

exports.validateUpdateProfile = (req, res, next) => {
  const { name, email } = req.body;

  if (!validators.isValidName(name)) {
    return next(new AppError('Invalid name format', 400));
  }

  if (!validators.isValidEmail(email)) {
    return next(new AppError('Invalid email format', 400));
  }

  next();
};

exports.validateAccount = (req, res, next) => {
  const { name, type, balance, currency } = req.body;

  if (!name || !type || balance === undefined || !currency) {
    return next(new AppError('Missing required fields', 400));
  }

  if (!validators.isValidAccountType(type)) {
    return next(new AppError('Invalid account type', 400));
  }

  if (!validators.isValidCurrency(currency)) {
    return next(new AppError('Invalid currency code', 400));
  }

  if (!validators.isValidAmount(balance)) {
    return next(new AppError('Invalid balance amount', 400));
  }

  next();
};

exports.validateTransaction = (req, res, next) => {
  const { amount, type, category, account, date } = req.body;

  if (!amount || !type || !category || !account) {
    return next(new AppError('Missing required fields', 400));
  }

  if (!validators.isValidTransactionType(type)) {
    return next(new AppError('Invalid transaction type', 400));
  }

  if (!validators.isValidAmount(amount)) {
    return next(new AppError('Invalid amount', 400));
  }

  if (date && !validators.isValidDate(date)) {
    return next(new AppError('Invalid date format', 400));
  }

  next();
};

exports.validateReportGeneration = (req, res, next) => {
  const { startDate, endDate, type } = req.body;

  if (!startDate || !endDate || !type) {
    return next(new AppError('Missing required fields', 400));
  }

  if (!validators.isValidDate(startDate) || !validators.isValidDate(endDate)) {
    return next(new AppError('Invalid date format', 400));
  }

  if (!validators.isValidReportType(type)) {
    return next(new AppError('Invalid report type', 400));
  }

  if (new Date(startDate) > new Date(endDate)) {
    return next(new AppError('Start date cannot be after end date', 400));
  }

  next();
}; 