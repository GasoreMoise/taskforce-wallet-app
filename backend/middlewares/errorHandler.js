const errorHandler = (err, req, res, next) => {
    const error = {
      status: err.status || 500,
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    };
  
    res.status(error.status).json({
      status: 'error',
      ...error
    });
  };
  
  module.exports = errorHandler; 