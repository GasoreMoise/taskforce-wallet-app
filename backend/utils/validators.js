const validator = require('validator');
const { TRANSACTION_TYPES, ACCOUNT_TYPES } = require('./constants');

const validators = {
  isValidEmail: (email) => {
    return validator.isEmail(email);
  },

  isValidName: (name) => {
    return typeof name === 'string' && 
           name.length >= 2 && 
           name.length <= 50 &&
           /^[a-zA-Z\s-]+$/.test(name);
  },

  isValidPassword: (password) => {
    return typeof password === 'string' &&
           password.length >= 8 &&
           /[A-Z]/.test(password) &&    // At least one uppercase
           /[a-z]/.test(password) &&    // At least one lowercase
           /[0-9]/.test(password) &&    // At least one number
           /[^A-Za-z0-9]/.test(password); // At least one special character
  },

  isValidAmount: (amount) => {
    return typeof amount === 'number' && 
           !isNaN(amount) && 
           amount >= 0 &&
           Number.isFinite(amount);
  },

  isValidDate: (date) => {
    return validator.isDate(new Date(date));
  },

  isValidTransactionType: (type) => {
    return Object.values(TRANSACTION_TYPES).includes(type);
  },

  isValidAccountType: (type) => {
    return Object.values(ACCOUNT_TYPES).includes(type);
  },

  isValidCurrency: (currency) => {
    return /^[A-Z]{3}$/.test(currency);
  },

  isValidReportType: (type) => {
    return ['expense', 'income', 'budget', 'summary'].includes(type);
  },

  isValidObjectId: (id) => {
    return validator.isMongoId(id);
  },

  isValidPeriod: (period) => {
    return ['daily', 'weekly', 'monthly', 'yearly'].includes(period);
  },

  isValidDescription: (description) => {
    return typeof description === 'string' && 
           description.length <= 500;
  },

  isValidCategory: (category) => {
    return typeof category === 'string' && 
           category.length >= 2 && 
           category.length <= 50;
  }
};

module.exports = validators; 