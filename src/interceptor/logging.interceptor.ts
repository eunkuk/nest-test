import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { catchError, Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const traceId = uuidv4();
    request.traceId = traceId;

    const now = Date.now();
    const { method, url, params, query, body } = request;

    const handlerName = context.getHandler().name;
    const controllerName = context.getClass().name;

    this.logger.info(`Start: ${controllerName} ${handlerName} ${method} ${url} ${traceId}`);
    this.logger.info(`Params: ${this.truncateAndStringify(params)}`);
    this.logger.info(`Query: ${this.truncateAndStringify(query)}`);
    this.logger.info(`Body: ${this.truncateAndStringify(body)}`);

    return next.handle().pipe(
      tap(() => {
        this.logger.info(`End: ${method} ${url} - ${Date.now() - now}ms ${traceId}`);
      }),
      catchError((error) => {
        this.logger.error(`End: ${method} ${url} - ${Date.now() - now}ms ${traceId} - Error: ${error.message}`);
        return throwError(() => error);
      }),
    );
  }

  private truncateAndStringify(obj: any, maxLength: number = 1000): string {
    const stringified = JSON.stringify(obj, this.replacer);
    if (stringified.length <= maxLength) {
      return stringified;
    }
    return stringified.substring(0, maxLength) + '... (truncated)';
  }

  private replacer(key: string, value: any): any {
    if (value !== null && typeof value === 'object') {
      if (value instanceof File || value instanceof Blob) {
        return `[${value.constructor.name}] size: ${value.size} bytes`;
      }
      if (Array.isArray(value) && value.length > 10) {
        return `[Array(${value.length})]`;
      }
    }
    if (typeof value === 'string' && value.length > 100) {
      return value.substring(0, 100) + '... (truncated)';
    }
    return value;
  }
}
