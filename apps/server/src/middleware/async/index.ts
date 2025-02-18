import { NextFunction, Request, Response } from 'express';

import { AppError } from '../../utils/appError';

type Controller = (req: Request, res: Response, next: NextFunction) => void;

/**
 * Wraps a controller function with try-catch block, and passes the caught
 * error to errorHandler.
 *
 * @param {Controller} fn - Controller function to wrap.
 *
 * @returns {Controller} Wrapped controller function.
 */
export const asyncHandler =
  (fn: Controller) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((error: AppError) => {
      next(error);
      // errorHandler(error, req, res, next);
    });
  };
