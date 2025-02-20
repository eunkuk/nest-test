import { Injectable, PipeTransform } from '@nestjs/common';
import { FILE_COUNT, FILE_SIZE, IFile } from 'src/constants/file';
import { ApiException } from 'src/lib/exception/api-exception';
import { CODE } from 'src/constants/code';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  constructor(
    private readonly maxSize: number | null = FILE_SIZE,
    private readonly maxFiles: number | null = FILE_COUNT,
    private allowedTypes: RegExp,
  ) {
    this.maxSize = maxSize !== null ? maxSize : FILE_SIZE;
    this.maxFiles = maxFiles !== null ? maxFiles : FILE_COUNT;
  }

  // 파일 배열을 받아 각 파일의 크기 검사
  async transform(value: IFile[]): Promise<IFile[]> {
    await this.validate(value);
    return value;
  }

  // IFile 배열의 유효성 검사
  async validate(value: IFile[]): Promise<void> {
    // 파일 배열이 비어있는지 검사
    if (!value || (Array.isArray(value) && value.length === 0)) {
      throw new ApiException(CODE.BAD_REQUEST);
    }

    // 파일 개수 검사
    if (value.length > this.maxFiles) {
      throw new ApiException(CODE.BAD_REQUEST, `최대 ${this.maxFiles}개의 파일만 업로드할 수 있습니다.`);
    }

    // 파일 타입 검사
    const invalidFile = value.find((file) => !this.allowedTypes?.test(file.mimetype));
    if (invalidFile) {
      throw new ApiException(CODE.BAD_REQUEST, `잘못된 파일 형식입니다: ${invalidFile.mimetype}`);
    }

    // 파일 크기 검사
    value.forEach((file) => {
      if (file.size > this.maxSize) {
        throw new ApiException(CODE.BAD_REQUEST, `파일 크기 제한을 초과했습니다. 제한: ${this.maxSize} byte.`);
      }
    });

    return;
  }
}
