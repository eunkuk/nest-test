import { Injectable, Logger } from '@nestjs/common';
import { S3Service } from 'src/aws/s3/s3.service';
import { createReadStream, existsSync, promises as fs } from 'fs';
import { join } from 'path';
import { ApiException } from 'src/lib/exception/api-exception';
import { CODE } from 'src/constants/code';

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);
  constructor(private readonly s3Service: S3Service) {}

  // 로컬 파일 업로드
  async uploadLocal(files: Express.Multer.File[]): Promise<string[]> {
    const dir = 'uploads';
    await fs.mkdir(dir, { recursive: true }).catch((err) => {
      throw new ApiException(CODE.IO_ERROR, err.message);
    });

    const items = [];
    for (const file of files) {
      const filepath = join(dir, file.originalname);
      await fs.writeFile(filepath, file.buffer);

      items.push({
        originalName: file.originalname,
        path: filepath,
      });
    }

    return items;
  }

  // S3 파일 업로드
  async uploadS3(files: Express.Multer.File[]): Promise<string[]> {
    const items: string[] = [];
    for (const file of files) {
      const key = await this.s3Service.putItemInBucket(file);
      items.push(key);
    }
    return items;
  }

  // 로컬 파일 다운로드
  async getFile(filename: string): Promise<NodeJS.ReadableStream> {
    const dir = 'uploads';
    const filePath = join(dir, filename);

    if (!existsSync(filePath)) {
      throw new ApiException(CODE.NOT_FOUND);
    }

    const stream = createReadStream(filePath);
    return stream;
  }
}
