import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { Injectable } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { CODE } from 'src/constants/code';
import Handlebars from 'handlebars';
import mailerConfig from './config/mailer.config';
import { ApiException } from 'src/lib/exception/api-exception';

@Injectable()
export class MailerService {
  private sesClient: SESClient;
  constructor(private configService: ConfigService) {
    const appConfig = this.configService.get<ConfigType<typeof mailerConfig>>('mailer');
    const { region, accessKeyId, secretAccessKey } = appConfig;

    this.sesClient = new SESClient({
      region: region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async sendEmail({
    template,
    bindItem,
    ...mailOptions
  }: {
    template: string;
    bindItem: Record<string, string>;
    receivers: string[];
    subject: string;
    sender: string;
  }): Promise<void> {
    const { receivers, subject, sender = 'email' } = mailOptions;
    let html = template;
    if (template && bindItem) {
      html = Handlebars.compile(template, {
        strict: true,
      })(bindItem);
    }

    const command = new SendEmailCommand({
      Destination: {
        CcAddresses: [],
        ToAddresses: receivers,
      },
      Message: {
        Body: { Html: { Charset: 'UTF-8', Data: html } },
        Subject: {
          Charset: 'UTF-8',
          Data: subject,
        },
      },
      Source: sender,
      ReplyToAddresses: [],
    });

    try {
      await this.sesClient.send(command);
    } catch (error) {
      throw new ApiException(CODE.INTERNAL_SERVER_ERROR, '메일 발송에 실패하였습니다.');
    }
  }
}
