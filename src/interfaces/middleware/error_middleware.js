/**
 * XJ3395 — Interfaces Layer
 * What this file handles: Global error handler.
 */
function errorMiddleware(err, req, res, next) {
  console.error(err);

  const errorResponse = {
    success: false,
    error: err.name || 'InternalServerError',
    message: err.message || 'An unexpected error occurred',
    statusCode: 500,
    timestamp: new Date()
  };

  if (err.name === 'InvalidWorkflowTransitionException' || err.name === 'PaymentNotSettledException') {
    errorResponse.statusCode = 422;
  } else if (err.isJoi || err.message.includes('required') || err.message.includes('must be')) {
    errorResponse.statusCode = 400;
    errorResponse.error = 'ValidationError';
  } else if (err.message.includes('not found')) {
    errorResponse.statusCode = 404;
    errorResponse.error = 'NotFoundError';
  }

  res.status(errorResponse.statusCode).json(errorResponse);
}

module.exports = { errorMiddleware };
