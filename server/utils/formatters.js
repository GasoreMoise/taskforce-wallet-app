const moment = require('moment');

const formatters = {
  formatCurrency: (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  },

  formatDate: (date, format = 'YYYY-MM-DD') => {
    return moment(date).format(format);
  },

  formatDateRange: (startDate, endDate) => {
    return {
      start: moment(startDate).startOf('day').toDate(),
      end: moment(endDate).endOf('day').toDate()
    };
  },

  formatPercentage: (value, decimals = 2) => {
    return `${(value * 100).toFixed(decimals)}%`;
  },

  formatTransactionType: (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  },

  formatResponseData: (data, includeTimestamps = false) => {
    if (Array.isArray(data)) {
      return data.map(item => formatters.formatSingleItem(item, includeTimestamps));
    }
    return formatters.formatSingleItem(data, includeTimestamps);
  },

  formatSingleItem: (item, includeTimestamps) => {
    if (!item || typeof item !== 'object') return item;

    const formatted = { ...item };

    // Format dates if they exist
    if (formatted.date) {
      formatted.date = formatters.formatDate(formatted.date);
    }
    if (formatted.startDate) {
      formatted.startDate = formatters.formatDate(formatted.startDate);
    }
    if (formatted.endDate) {
      formatted.endDate = formatters.formatDate(formatted.endDate);
    }

    // Format amounts if they exist
    if (formatted.amount) {
      formatted.formattedAmount = formatters.formatCurrency(formatted.amount);
    }

    // Remove timestamps unless specifically requested
    if (!includeTimestamps) {
      delete formatted.createdAt;
      delete formatted.updatedAt;
      delete formatted.__v;
    }

    return formatted;
  },

  formatError: (error) => {
    return {
      message: error.message,
      code: error.code || 500,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    };
  }
};

module.exports = formatters; 