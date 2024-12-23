import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from './common/http-exception.filter';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { TransformInterceptor } from './common/transform.interceptor';
import { BaseAPIDoc } from './config/swagger.document';
import { SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService);

  // app.useGlobalPipes(new ValidationPipe());

  const config = new BaseAPIDoc().initializeOptions();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalInterceptors(new TransformInterceptor());

  app.use(cookieParser());

  await app.listen(configService.get('PORT') ?? 8000);

  // await app.listen(8000);
}
bootstrap();
