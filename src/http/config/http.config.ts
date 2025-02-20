import { registerAs } from '@nestjs/config';

export type HttpConfig = {
  timeout?: number;
  max_redirects?: number;
};

export default registerAs<HttpConfig>('http', () => {
  return {
    timeout: parseInt(process.env.HTTP_TIMEOUT),
    max_redirects: parseInt(process.env.HTTP_MAX_REDIRECTS),
  };
});
