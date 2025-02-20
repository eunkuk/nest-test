import { HttpStatus } from '@nestjs/common';
import { ApiParamOptions, ApiQueryOptions } from '@nestjs/swagger';
import { ClassConstructor } from 'class-transformer';
import { ENUM_REQUEST_TYPE } from 'src/constants/api.doc';

export interface IDocOptions {
  summary?: string;
  operation?: string;
  deprecated?: boolean;
  description?: string;
}

export interface IDocOfOptions<T = any> {
  status: HttpStatus;
  code: string;
  msg: string;
  data?: ClassConstructor<T> | string;
}

export interface IDocRequestOptions<T = any> {
  summary?: string;
  description?: string;
  params?: ApiParamOptions[];
  queries?: ApiQueryOptions[];
  bodyType?: ENUM_REQUEST_TYPE;
  dto?: ClassConstructor<T>;
  sample?: T;
}
