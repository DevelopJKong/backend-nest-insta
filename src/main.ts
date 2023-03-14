import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';
import * as fs from 'fs';
import * as express from 'express';
import { BACKEND_URL, PORT, fileFolder, DEV } from './common/common.constants';
import { join } from 'path';
// ! LoggerInterceptor 사용 시
import { LoggerInterceptor } from './libs/logger/logger.interceptor';
import { LoggerService } from './libs/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (process.env.NODE_ENV === DEV) {
    if (!fs.existsSync(fileFolder)) fs.mkdirSync(fileFolder);
  }

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.use(graphqlUploadExpress({ maxFileSize: 1000000, maxFiles: 10 }));
  app.use('/files', express.static(join(__dirname, '../files')));
  app.enableCors();

  // ! LoggerInterceptor 사용 시
  app.useGlobalInterceptors(new LoggerInterceptor(new LoggerService({ nodeEnv: process.env.NODE_ENV })));

  const start = () => console.log(`Server Start! ${BACKEND_URL}`);
  await app.listen(PORT, start);
}

bootstrap();
