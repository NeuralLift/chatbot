/* eslint-disable @typescript-eslint/no-unused-vars */
import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import { HTTPSTATUS } from '../../configs/http';
import { ErrorCodeEnum } from '../../types/enums/error';
import { AppError } from '../../utils/appError';
import AppResponse from '../../utils/appResponse';

/**
 * Handles any errors that occur within the application. It logs the error
 * with the current request path and method, and returns a JSON response with
 * the error message and status code. If the error is a ZodError, it includes
 * the validation errors in the response. If the error is an AppError, it
 * includes the error code in the response.
 * @param {Error} err The error that occurred
 * @param {Request} req The request object
 * @param {Response} res The response object
 * @param {NextFunction} _next The next middleware function in the stack
 * @returns {void}
 */
export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(`
    \x1b[31mError Occurred:\x1b[0m
    \x1b[34mPATH:\x1b[0m "${req.path}"
    \x1b[34mMETHOD:\x1b[0m "${req.method}"
    \x1b[34mMESSAGE:\x1b[0m "${err.message}"
  `);

  switch (true) {
    case err instanceof SyntaxError:
      new AppResponse({
        res,
        message: 'Invalid JSON format. Please check your request body.',
        success: false,
        error: err.name,
        errorCode: 'JSON_FORMAT_ERROR',
        statusCode: HTTPSTATUS.BAD_REQUEST,
      });
      break;
    case err instanceof ZodError:
      new AppResponse({
        res,
        message: 'Validation failed',
        success: false,
        error: err.name,
        errors: err.issues,
        errorCode: ErrorCodeEnum.VALIDATION_ERROR,
        statusCode: HTTPSTATUS.BAD_REQUEST,
      });
      break;
    case err instanceof AppError:
      new AppResponse({
        res,
        message: err.message,
        success: false,
        error: err.name,
        statusCode: err.statusCode,
        errorCode: err.errorCode,
      });
      break;
    default:
      new AppResponse({
        res,
        message: 'Internal Server Error',
        success: false,
        error: err.message || 'Unknown error occurred',
        errorCode: ErrorCodeEnum.INTERNAL_SERVER_ERROR,
        statusCode: HTTPSTATUS.INTERNAL_SERVER_ERROR,
      });
      break;
  }
};
