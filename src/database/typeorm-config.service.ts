import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { AllConfigType } from '../config/config.type';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService<AllConfigType>) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: this.configService.get('database.type', { infer: true }), // 데이터베이스 타입 설정
      url: this.configService.get('database.url', { infer: true }), // 데이터베이스 URL 설정
      host: this.configService.get('database.host', { infer: true }), // 데이터베이스 호스트 설정
      port: this.configService.get('database.port', { infer: true }), // 데이터베이스 포트 설정
      username: this.configService.get('database.username', { infer: true }), // 데이터베이스 사용자 이름 설정
      password: this.configService.get('database.password', { infer: true }), // 데이터베이스 비밀번호 설정
      database: this.configService.get('database.name', { infer: true }), // 데이터베이스 이름 설정
      synchronize: this.configService.get('database.synchronize', {
        infer: true,
      }), // 데이터베이스 동기화 설정
      dropSchema: false, // 스키마 드랍 설정 (기본값 false)
      schema: this.configService.get('database.schema', { infer: true }), // 스키마 설정
      keepConnectionAlive: true, // 연결 유지 설정 (기본값 true)
      logging: this.configService.get('app.nodeEnv', { infer: true }) !== 'prod', // 로그 설정 (프로덕션 환경에서는 로그 비활성화)
      autoLoadEntities: true, // 엔티티 자동 로드 옵션 설정
      // entities: [__dirname + '/../entities/*.entity{.ts,.js}'], // 엔티티 파일 경로 설정
      // migrations: [__dirname + '/migrations/**/*{.ts,.js}'], // 마이그레이션 파일 경로 설정
      cli: {
        entitiesDir: 'src', // CLI용 엔티티 디렉토리 설정
        subscribersDir: 'subscriber', // CLI용 구독자 디렉토리 설정
      },
      extra: {
        // based on https://node-postgres.com/apis/pool
        // max connection pool size
        max: this.configService.get('database.maxConnections', { infer: true }), // 최대 연결 풀 크기 설정
        ssl: this.configService.get('database.sslEnabled', { infer: true })
          ? {
              rejectUnauthorized: this.configService.get('database.rejectUnauthorized', { infer: true }), // SSL 설정: 인증서 거부 여부 설정
              ca: this.configService.get('database.ca', { infer: true }) ?? undefined, // SSL 설정: CA 인증서
              key: this.configService.get('database.key', { infer: true }) ?? undefined, // SSL 설정: 키 파일
              cert: this.configService.get('database.cert', { infer: true }) ?? undefined, // SSL 설정: 인증서 파일
            }
          : undefined, // SSL 설정: SSL 비활성화 시 undefined
      },
    } as TypeOrmModuleOptions;
  }
}
