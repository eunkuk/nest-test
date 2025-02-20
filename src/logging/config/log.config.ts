import { registerAs } from '@nestjs/config';
import { HttpConfig } from "../../http/config/http.config";

export type LogConfig = {
  level?: string;
  path?: string;
};

export default registerAs<LogConfig>('log', () => {
  return {
    level: process.env.LOG_LEVEL,
    path: process.env.LOG_PATH,
  };
});
