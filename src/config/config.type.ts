import { AppConfig } from './app.config';
import { DatabaseConfig } from '../database/config/database.config';
import { AuthConfig } from '../auth/config/auth.config';
import { MailerConfig } from 'src/mailer/config/mailer.config';
import { HttpConfig } from '../http/config/http.config';
import { S3Config } from 'src/aws/s3/config/s3.config';
import { RedisConfig } from '../redis/config/redis.config';

// 각 모듈에서 활용되는 Config를 모아놓은 파일
export type AllConfigType = {
  app: AppConfig;
  database: DatabaseConfig;
  auth: AuthConfig;
  mailer: MailerConfig;
  http: HttpConfig;
  s3: S3Config;
  redis: RedisConfig;
};
