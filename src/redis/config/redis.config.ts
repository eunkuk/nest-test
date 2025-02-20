import { registerAs } from '@nestjs/config';

export type RedisConfig = {
  host?: string;
  port?: number;
  password?: string;
  db?: string;
};

export default registerAs<RedisConfig>('redis', () => {
  return {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
    db: process.env.REDIS_DB,
  };
});
