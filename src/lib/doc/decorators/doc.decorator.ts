import { applyDecorators, UseInterceptors } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { IDocOfOptions, IDocOptions, IDocRequestOptions } from '../interfaces/doc.interface';
import { ResponseEntity } from '../../response/response-entity';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CODE } from 'src/constants/code';
import { ENUM_REQUEST_TYPE } from 'src/constants/api.doc';

// 설명을 위한 데코레이터
export function apiOperationDoc(options?: IDocOptions): MethodDecorator {
  return applyDecorators(
    ApiOperation({
      summary: options?.summary,
      deprecated: options?.deprecated,
      description: options?.description,
      operationId: options?.operation,
    }),
  );
}

// API 요청에 대한 문서화를 위한 데코레이터
export function apiRequesDoc(options?: IDocRequestOptions): MethodDecorator {
  const docs: Array<ClassDecorator | MethodDecorator> = [];

  // 요청에 대한 설명을 추가
  if (options?.summary) {
    docs.push(
      ApiOperation({
        summary: options?.summary,
        description: options?.description,
      }),
    );
  }

  // 요청에 대한 bodyType을 추가
  if (!options?.bodyType) {
    docs.push(ApiConsumes('application/json'));
  } else if (options?.bodyType === ENUM_REQUEST_TYPE.FORM_DATA) {
    docs.push(ApiConsumes('multipart/form-data'));
    docs.push(UseInterceptors(FilesInterceptor('file')));
    docs.push(
      ApiBody({
        schema: {
          type: 'object',
          properties: {
            ['file']: {
              type: 'array',
              items: {
                type: 'string',
                format: 'binary',
              },
            },
          },
          required: ['file'],
        },
      }),
    );
  } else if (options?.bodyType === ENUM_REQUEST_TYPE.TEXT) {
    docs.push(ApiConsumes('text/plain'));
  }

  // 요청에 대한 dto body에 추가
  if (options?.dto) {
    docs.push(
      ApiBody({
        type: options?.dto,
        examples: {
          '-': {
            value: {
              ...options.sample,
            },
          },
        },
      }),
    );
  }

  return applyDecorators(...docs);
}

// API 응답에 대한 문서화를 위한 데코레이터
export function apiResponseDoc<T>(options: IDocOfOptions<T>): MethodDecorator {
  const docs = [];

  const schema: Record<string, any> = {
    allOf: [{ $ref: getSchemaPath(ResponseEntity) }],
    properties: {
      message: {
        type: 'string',
        data: options.msg,
      },
      code: {
        type: 'string',
        data: options.code,
      },
    },
  };

  // 성공일 경우 설명
  if (options.code == 'G0000') schema.properties['data'] = { type: 'string' };

  return applyDecorators(
    ApiExtraModels(ResponseEntity),
    ApiResponse({
      description: options.status.toString(),
      status: options.status,
      schema,
    }),
    ...docs,
  );
}

// 데코레이터를 통해 인증이 필요한 API에 대한 문서화를 위한 데코레이터
export function apiGuardDoc(...decorators: MethodDecorator[]): MethodDecorator {
  const docs: Array<ClassDecorator | MethodDecorator> = [];
  docs.push(ApiBearerAuth());
  docs.push(apiResponseDoc(CODE.UNAUTHORIZED));
  docs.push(apiResponseDoc(CODE.TOKEN_EXPIRED));
  docs.push(apiResponseDoc(CODE.INVALID_TOKEN));

  return applyDecorators(...docs, ...decorators);
}

// 데코레이터를 통합 위한 함수
export function apiDocSum(...decorators: MethodDecorator[]): MethodDecorator {
  const docs: Array<ClassDecorator | MethodDecorator> = [];
  docs.push(apiResponseDoc({ ...CODE.OK, data: 'success message or file' }));
  docs.push(apiResponseDoc(CODE.BAD_REQUEST));
  docs.push(apiResponseDoc(CODE.INTERNAL_SERVER_ERROR));

  return applyDecorators(...docs, ...decorators);
}
