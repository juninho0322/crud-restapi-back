import type { Request, Response } from "express";

// This middleware runs after all valid routes.
// If a request gets here, Express did not find a matching route.
export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
}
