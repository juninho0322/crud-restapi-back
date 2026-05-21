// This middleware runs after all valid routes.
// If a request gets here, Express did not find a matching route.
export function notFoundHandler(req, res) {
  res.status(404).json({
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
}
