function notFoundHandler(req, res) {
  res.status(404).json({ error: 'Not found' });
}

// Central error handler — always returns a clean JSON message, never a stack trace to the client.
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  const status = err.status || err.statusCode || 500;
  if (status >= 500) {
    console.error(err);
  }
  res.status(status).json({ error: err.message || 'Internal server error' });
}

module.exports = { notFoundHandler, errorHandler };
