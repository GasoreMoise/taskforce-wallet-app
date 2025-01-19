const cacheService = require('../services/cacheService');

exports.cacheMiddleware = (duration) => {
  return async (req, res, next) => {
    // Skip caching for non-GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = `${req.user.id}:${req.originalUrl}`;
    
    try {
      const cachedData = await cacheService.get(key);
      
      if (cachedData) {
        return res.status(200).json({
          status: 'success',
          data: cachedData,
          source: 'cache'
        });
      }

      // Modify res.json to cache the response
      const originalJson = res.json;
      res.json = function(body) {
        if (body.status === 'success') {
          cacheService.set(key, body.data, duration);
        }
        return originalJson.call(this, body);
      };

      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
};

exports.clearCache = (prefix) => {
  return async (req, res, next) => {
    const originalJson = res.json;
    res.json = async function(body) {
      if (body.status === 'success') {
        await cacheService.clearUserCache(`${req.user.id}:${prefix}`);
      }
      return originalJson.call(this, body);
    };
    next();
  };
}; 