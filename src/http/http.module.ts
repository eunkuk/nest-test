import { Injectable, Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule, HttpService } from '@nestjs/axios';
import { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { catchError, lastValueFrom, throwError } from 'rxjs';
import { AllConfigType } from '../config/config.type';
import { CODE } from '../constants/code';
import { ApiException } from '../lib/exception/api-exception';

@Injectable()
export class CustomHttpService {
  private readonly logger = new Logger(CustomHttpService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService<AllConfigType>,
  ) {}

  private async handleRequest<T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    const defaultTimeout = this.configService.get<number>('http.timeout', { infer: true });
    const defaultMaxRedirects = this.configService.get<number>('http.max_redirects', { infer: true });

    const mergedConfig = {
      timeout: defaultTimeout,
      maxRedirects: defaultMaxRedirects,
      ...config,
    };

    this.logger.log(`Request: ${JSON.stringify(mergedConfig)}`);

    return lastValueFrom(
      this.httpService.request<T>(mergedConfig).pipe(
        catchError((error) => {
          this.logger.error(`Error: ${JSON.stringify(error)}`);
          return throwError(() => this.handleRequestError(error));
        }),
      ),
    ).then((response) => {
      this.logger.log(`Response: ${JSON.stringify(response.data)}`);
      return response;
    });
  }

  private handleRequestError(error: any) {
    if (error.isAxiosError) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        if (axiosError.response.status >= 400 && axiosError.response.status < 500) {
          throw new ApiException(CODE.BAD_REQUEST);
        } else if (axiosError.response.status >= 500) {
          throw new ApiException(CODE.INTERNAL_SERVER_ERROR);
        }
      } else if (axiosError.request) {
        if (axiosError.code === 'ECONNABORTED') {
          throw new ApiException(CODE.EXTERNAL_TIMEOUT);
        }
        throw new ApiException(CODE.NO_RESPONSE);
      } else {
        throw new ApiException(CODE.REQUEST_SETUP_ERROR);
      }
    } else {
      throw new ApiException(CODE.UNKNOWN_ERROR);
    }
  }

  async request<T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.handleRequest<T>(config);
  }

  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.request<T>({ ...config, method: 'GET', url });
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.request<T>({ ...config, method: 'POST', url, data });
  }
}

@Module({
  imports: [ConfigModule, HttpModule],
  providers: [CustomHttpService],
  exports: [CustomHttpService],
})
export class CustomHttpModule {}
