import { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Wraps async route handlers so any thrown error / rejected promise
 * is forwarded to Express's error middleware instead of crashing
 * the process or hanging the request. This is the #1 source of
 * "random" Node backend crashes for beginners — this fixes that.
 */
export const asyncHandler =
  (fn: RequestHandler) =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
