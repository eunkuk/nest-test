import { registerAs } from '@nestjs/config';

export type MailerConfig = {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
};

export default registerAs<MailerConfig>('mailer', () => {
  return {
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  };
});
