import type { NextFunction, Request, Response } from "express";

// This is the final safety net for unexpected errors.
// Express knows it is an error handler because it has four parameters.
export function errorHandler(error: unknown, req: Request, res: Response, next: NextFunction) {
  console.error(error);

  res.status(500).json({
    message: "Internal server error"
  });
}
