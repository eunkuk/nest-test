import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ApiExceptionFilter } from './filters/api-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new ApiExceptionFilter());
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const options = new DocumentBuilder()
    .setTitle('BE 템블릿 API')
    .setDescription('BE 기본 템플릿 API 문서입니다.')
    .setVersion('1.0.1')
    .addServer('http://192.168.0.48:3000/', 'local-environment')
    .addTag('Login', '로그인 관련 기능을 제공 API')
    .addTag('Exam', '기본 제공하는 API')
    .addTag('Exam-Auth', '토큰 인증이 필요한 Exam API')
    .addTag('File', '파일 업로드, 다운로드 등 파일 관련 기능을 제공하는 API')
    .addBearerAuth({
      type: 'http',
      bearerFormat: 'JWT',
      in: 'Header',
      name: 'Authorization',
      scheme: 'bearer',
    })
    .setExternalDoc('Postman Collection', '/api-docs-json')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: { defaultModelsExpandDepth: -1, docExpansion: 'none', persistAuthorization: true },
  });

  await app.listen(3000);
}

bootstrap().catch((bootError) => {
  console.error(bootError);
  process.exit(1);
});
