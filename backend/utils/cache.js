const crypto = require('crypto');

const cacheUtils = {
  generateKey: (prefix, params) => {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((acc, key) => {
        acc[key] = params[key];
        return acc;
      }, {});

    const paramsString = JSON.stringify(sortedParams);
    const hash = crypto
      .createHash('md5')
      .update(paramsString)
      .digest('hex');

    return `${prefix}:${hash}`;
  },

  parseKey: (key) => {
    const [prefix, hash] = key.split(':');
    return { prefix, hash };
  },

  shouldCache: (req) => {
    // Don't cache if user is not authenticated
    if (!req.user) return false;

    // Only cache GET requests
    if (req.method !== 'GET') return false;

    // Don't cache if specific header is present
    if (req.headers['x-skip-cache']) return false;

    return true;
  },

  getExpiryTime: (type) => {
    const times = {
      short: 300,    // 5 minutes
      medium: 3600,  // 1 hour
      long: 86400,   // 1 day
      default: 1800  // 30 minutes
    };

    return times[type] || times.default;
  },

  serializeData: (data) => {
    try {
      return JSON.stringify(data);
    } catch (error) {
      console.error('Cache serialization error:', error);
      return null;
    }
  },

  deserializeData: (data) => {
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error('Cache deserialization error:', error);
      return null;
    }
  }
};

module.exports = cacheUtils; 