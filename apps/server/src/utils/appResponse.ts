import { Response } from 'express';
import { ZodIssue } from 'zod';

class AppResponse<T = unknown> {
  res: Response;
  message: string;
  success: boolean;
  data?: T;
  error?: unknown;
  errors?: ZodIssue[];
  errorCode?: string;
  statusCode: number;

  constructor({
    res,
    message,
    success,
    data,
    error,
    errors,
    errorCode,
    statusCode,
  }: {
    res: Response;
    message: string;
    success: boolean;
    data?: T;
    error?: unknown;
    errors?: ZodIssue[];
    errorCode?: string;
    statusCode: number;
  }) {
    this.res = res;
    this.message = message;
    this.success = success;
    this.data = data;
    this.error = error;
    this.errors = errors;
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.send();
  }

  send() {
    return this.res.status(this.statusCode).json({
      message: this.message,
      success: this.success,
      data: this.data,
      error: this.error,
      errors: this.formatZodErrors(this.errors),
      errorCode: this.errorCode,
    });
  }

  formatZodErrors(errors: ZodIssue[] | undefined) {
    if (!errors) return undefined;

    return errors.map((error) => ({
      field: error.path.join('.'),
      message: error.message,
    }));
  }
}

export default AppResponse;
