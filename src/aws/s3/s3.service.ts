import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { ApiException } from 'src/lib/exception/api-exception';
import { CODE } from 'src/constants/code';
import { Readable } from 'typeorm/platform/PlatformTools';
import s3Config from './config/s3.config';

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);
  private s3Client: S3Client;
  private defaultBucket: string;
  private defaultRegion: string;
  constructor(private configService: ConfigService) {
    const appConfig = this.configService.get<ConfigType<typeof s3Config>>('s3');
    const { accessKeyId, secretAccessKey, bucketName, region } = appConfig;

    this.defaultBucket = bucketName;
    this.defaultRegion = region;
    this.s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  // 버킷 파일 업로드
  async putItemInBucket(file: Express.Multer.File) {
    const { originalname, buffer } = file;
    const folderPath = 'temp/';
    const destination = `${folderPath}${originalname}`;
    const command = new PutObjectCommand({
      Bucket: this.defaultBucket,
      Key: destination,
      Body: buffer,
    });

    try {
      await this.s3Client.send(command);
      return `https://${this.defaultBucket}.s3.${this.defaultRegion}.amazonaws.com/${destination}`;
    } catch (error) {
      throw new ApiException(CODE.INTERNAL_SERVER_ERROR, error.message);
    }
  }

  // 버킷 파일 가져오기
  async getItemInBucket(filename: string): Promise<Readable> {
    const folderPath = 'temp/';
    const destination = `${folderPath}${filename}`;
    const command = new GetObjectCommand({
      Bucket: this.defaultBucket,
      Key: destination,
    });

    try {
      const item = await this.s3Client.send(command);
      return item.Body as Readable;
    } catch (error) {
      throw new ApiException(CODE.INTERNAL_SERVER_ERROR, error.message);
    }
  }
}
