// This is the final safety net for unexpected errors.
// Express knows it is an error handler because it has four parameters:
// error, req, res, next.
export function errorHandler(error, req, res, next) {
  console.error(error);

  res.status(500).json({
    message: "Internal server error"
  });
}
