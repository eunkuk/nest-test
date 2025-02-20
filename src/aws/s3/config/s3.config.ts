import { registerAs } from '@nestjs/config';

export type S3Config = {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
};

export default registerAs<S3Config>('s3', () => {
  return {
    region: process.env.AWS_REGION || '',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    bucketName: process.env.AWS_BUCKET_NAME || '',
  };
});
