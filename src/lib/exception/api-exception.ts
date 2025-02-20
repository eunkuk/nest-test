import { HttpException } from '@nestjs/common';
import { IStatus } from '../../constants/code';

export class ApiException extends HttpException {
  error: IStatus;
  code: string;

  constructor(error: IStatus, message?: string) {
    super(message || error.msg, error.status);
    this.error = error;
    this.error.msg = message || error.msg;
  }

  getError(): IStatus {
    return this.error;
  }

  getDetail(): string | undefined {
    return this.error.msg;
  }
}
