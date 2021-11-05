exports.notFoundHandler = (req, res, next) => {
  res.status(404);
  const error = new Error('Route not found');
  return next(error);
};

// eslint-disable-next-line no-unused-vars
exports.errorHandler = (err, req, res, next) => {
  if (res.statusCode === 200) res.status(500);

  return res.json({
    ok: false,
    error: {
      message: err.message ?? 'Internal Server Error',
      stack: process.env.NODE_ENV !== 'production' ? err.stack : '👎',
    },
  });
};
