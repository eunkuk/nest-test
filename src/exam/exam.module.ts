import { Module } from '@nestjs/common';
import { ExamService } from './exam.service';
import { ExamController } from './exam.controller';
import { ExamAuthController } from './exam.auth.controller';
import { MailerModule } from '../mailer/mailer.module';
import { ExternalParserModule } from '../parser/external.parser.module';

@Module({
  imports: [MailerModule, ExternalParserModule],
  controllers: [ExamController, ExamAuthController],
  providers: [ExamService],
})
export class ExamModule {}
