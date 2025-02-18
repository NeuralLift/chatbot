import { HTTPSTATUS, HttpStatusCodeType } from '../configs/http';
import { ErrorCodeEnum, ErrorCodeEnumType } from '../types/enums/error';

export class AppError extends Error {
  public statusCode: HttpStatusCodeType;
  public errorCode?: ErrorCodeEnumType;

  constructor(
    message: string,
    statusCode = HTTPSTATUS.INTERNAL_SERVER_ERROR,
    errorCode?: ErrorCodeEnumType
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    Error.captureStackTrace(this, this.constructor);
  }

  public static httpException(
    message = 'Http Exception Error',
    statusCode: HttpStatusCodeType,
    errorCode?: ErrorCodeEnumType
  ): AppError {
    throw new AppError(message, statusCode, errorCode);
  }

  public static internalServerError(
    message = 'Internal Server Error',
    errorCode?: ErrorCodeEnumType
  ): AppError {
    throw new AppError(
      message,
      HTTPSTATUS.INTERNAL_SERVER_ERROR,
      errorCode || ErrorCodeEnum.INTERNAL_SERVER_ERROR
    );
  }

  public static notFound(
    message = 'Resource not found',
    errorCode?: ErrorCodeEnumType
  ): AppError {
    throw new AppError(
      message,
      HTTPSTATUS.NOT_FOUND,
      errorCode || ErrorCodeEnum.RESOURCE_NOT_FOUND
    );
  }

  public static badRequest(
    message = 'Bad Request',
    errorCode?: ErrorCodeEnumType
  ): AppError {
    throw new AppError(
      message,
      HTTPSTATUS.BAD_REQUEST,
      errorCode || ErrorCodeEnum.VALIDATION_ERROR
    );
  }

  public static unauthorized(
    message = 'Unauthorized Access',
    errorCode?: ErrorCodeEnumType
  ): AppError {
    throw new AppError(
      message,
      HTTPSTATUS.UNAUTHORIZED,
      errorCode || ErrorCodeEnum.ACCESS_UNAUTHORIZED
    );
  }
}
