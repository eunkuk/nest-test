import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { CODE, IStatus } from '../constants/code';
import { ApiException } from '../lib/exception/api-exception';

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let error: IStatus;

    if (exception instanceof ApiException) {
      error = exception.getError();
    } else if (exception instanceof HttpException) {
      const status = exception.getStatus();
      error = this.getErrorByStatus(status);
    } else {
      console.error(exception); // winston 의존성 주입 불가로 console 처리
      error = CODE.UNKNOWN_ERROR;
    }

    response.status(error.status).json({
      code: error.code,
      message: error.msg,
      data: null,
    });
  }

  private getErrorByStatus(status: number): IStatus {
    switch (status) {
      case 400:
        return CODE.BAD_REQUEST;
      case 401:
        return CODE.UNAUTHORIZED;
      case 403:
        return CODE.FORBIDDEN;
      case 404:
        return CODE.NOT_FOUND;
      case 405:
        return CODE.METHOD_NOT_ALLOWED;
      case 409:
        return CODE.CONFLICT;
      case 422:
        return CODE.UNPROCESSABLE_ENTITY;
      case 408:
        return CODE.INTERNAL_TIMEOUT;
      case 500:
        return CODE.INTERNAL_SERVER_ERROR;
      case 501:
        return CODE.NOT_IMPLEMENTED;
      case 502:
        return CODE.BAD_GATEWAY;
      case 503:
        return CODE.SERVICE_UNAVAILABLE;
      default:
        return CODE.UNKNOWN_ERROR;
    }
  }
}
