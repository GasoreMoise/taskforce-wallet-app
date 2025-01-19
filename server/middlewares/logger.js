const logger = require('../utils/logger');

const loggerMiddleware = (req, res, next) => {
  // Generate request ID
  req.requestId = require('crypto').randomBytes(16).toString('hex');

  // Log request
  logger.info({
    requestId: req.requestId,
    method: req.method,
    path: req.path,
    query: req.query,
    body: req.method === 'POST' || req.method === 'PUT' ? req.body : undefined,
    ip: req.ip,
    userAgent: req.get('user-agent'),
    userId: req.user ? req.user.id : undefined
  });

  // Track response time
  const start = Date.now();

  // Override res.json to log response
  const originalJson = res.json;
  res.json = function(body) {
    const responseTime = Date.now() - start;
    
    logger.info({
      requestId: req.requestId,
      responseTime,
      statusCode: res.statusCode,
      responseBody: process.env.NODE_ENV === 'development' ? body : undefined
    });

    return originalJson.call(this, body);
  };

  // Log errors
  res.on('finish', () => {
    if (res.statusCode >= 400) {
      logger.error({
        requestId: req.requestId,
        statusCode: res.statusCode,
        method: req.method,
        path: req.path
      });
    }
  });

  next();
};

module.exports = loggerMiddleware; 