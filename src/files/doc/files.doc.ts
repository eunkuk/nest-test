import { ENUM_REQUEST_TYPE } from 'src/constants/api.doc';
import { CODE } from 'src/constants/code';
import { apiDocSum, apiRequesDoc, apiResponseDoc } from 'src/lib/doc/decorators/doc.decorator';

export function FileLocalPost(): MethodDecorator {
  return apiDocSum(
    apiRequesDoc({
      summary: '파일 업로드',
      description: '파일을 서버 스토리지에 업로드합니다.',
      bodyType: ENUM_REQUEST_TYPE.FORM_DATA,
      dto: Array<Express.Multer.File>,
    }),
    apiResponseDoc(CODE.IO_ERROR),
  );
}

export function FileS3Post(): MethodDecorator {
  return apiDocSum(
    apiRequesDoc({
      summary: '파일 업로드',
      description: '파일을 S3에 업로드합니다.',
      bodyType: ENUM_REQUEST_TYPE.FORM_DATA,
      dto: Array<Express.Multer.File>,
    }),
    apiResponseDoc(CODE.IO_ERROR),
  );
}

export function FileGet(): MethodDecorator {
  return apiDocSum(
    apiRequesDoc({
      summary: '파일 다운로드',
    }),
    apiResponseDoc(CODE.NOT_FOUND),
  );
}
