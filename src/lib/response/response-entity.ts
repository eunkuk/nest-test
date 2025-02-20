import { Exclude, Expose } from 'class-transformer';
import { CODE, IStatus } from '../../constants/code';
import { ApiException } from '../exception/api-exception';

export class ResponseEntity<T> {
  @Exclude() private readonly code: string;
  @Exclude() private readonly message: string;
  @Exclude() private readonly data: T;

  private constructor(status: IStatus, message: string, data: T) {
    this.code = status.code;
    this.message = message;
    this.data = data;
  }

  static OK<T>(data?: T, message?: string): ResponseEntity<T> {
    data = data || null;
    message = message || 'OK';
    return new ResponseEntity<T>(CODE.OK, message, data);
  }

  static ERROR<T>(status: IStatus, message?: string): ResponseEntity<T> {
    throw new ApiException(status, message);
  }

  @Expose()
  get getCode(): string {
    return this.code;
  }

  @Expose()
  get getMessage(): string {
    return this.message;
  }

  @Expose()
  get getData(): T {
    return this.data;
  }
}
