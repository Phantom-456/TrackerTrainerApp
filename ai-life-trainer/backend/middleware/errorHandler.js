const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Default error status and message
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  // Custom error response based on error type
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 'error',
      message: 'Validation Error',
      details: err.details
    });
  }

  if (err.name === 'DatabaseError') {
    return res.status(503).json({
      status: 'error',
      message: 'Database Error',
      details: process.env.NODE_ENV === 'development' ? err.message : 'Database operation failed'
    });
  }

  // Generic error response
  res.status(status).json({
    status: 'error',
    message: process.env.NODE_ENV === 'development' ? message : 'Something went wrong'
  });
};

module.exports = errorHandler;
