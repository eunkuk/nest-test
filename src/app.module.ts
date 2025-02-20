import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';

import { TypeOrmConfigService } from './database/typeorm-config.service';
import databaseConfig from './database/config/database.config';
import appConfig from './config/app.config';
import authConfig from './auth/config/auth.config';

import { ExamModule } from './exam/exam.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from './database/database.module';
import { IgnoreFaviconMiddleware } from './middleware/ignore-favicon.middleware';
import { MailerModule } from './mailer/mailer.module';
import { CustomHttpModule } from './http/http.module';
import mailerConfig from './mailer/config/mailer.config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './interceptor/logging.interceptor';
import httpConfig from './http/config/http.config';
import { ExternalParserModule } from './parser/external.parser.module';
import { CustomScheduleModule } from './schedule/custom.schedule.module';
import { S3Module } from './aws/s3/s3.module';
import { FilesModule } from './files/files.module';
import s3Config from './aws/s3/config/s3.config';
import { RedisModule } from './redis/redis.module';
import redisConfig from './redis/config/redis.config';
import { WinstonModule } from "nest-winston";
import { LoggingModule } from "./logging/logging.module";

// 환경 파일 경로를 실행 환경에 맞게 설정합니다.
const envFilePath = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env.local';

const infrastructureDatabaseModule = TypeOrmModule.forRootAsync({
  useClass: TypeOrmConfigService,
  dataSourceFactory: async (options: DataSourceOptions) => {
    return new DataSource(options).initialize();
  },
});

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // ConfigModule을 전역 모듈로 설정합니다.
      load: [appConfig, databaseConfig, authConfig, mailerConfig, httpConfig, s3Config, redisConfig], // 설정 로드
      envFilePath: [envFilePath], // 환경 파일 경로 설정
    }),
    infrastructureDatabaseModule, // 데이터베이스 모듈 설정
    DatabaseModule, // Database 모듈 추가
    JwtModule, // JWT 모듈 추가
    ExamModule, // Exam 모듈 추가
    AuthModule, // Auth 모듈 추가
    MailerModule, // Mailer 모듈 추가
    CustomHttpModule, // Http 모듈 추가
    ExternalParserModule, // ExternalParser 모듈 추가
    CustomScheduleModule, // Schedule 모듈 추가
    S3Module, // S3 모듈 추가
    FilesModule, // Files 모듈 추가
    RedisModule, // Redis 모듈 추가
    LoggingModule, // Logging 모듈 추가
  ],
  // 전역 interceptor 추가
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
  // 전역에서 쓰이는 module은 여기에 추가
  exports: [DatabaseModule, JwtModule, CustomHttpModule, S3Module, RedisModule, LoggingModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IgnoreFaviconMiddleware).forRoutes('*');
  }
}
