import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';
import * as fs from 'fs';
import * as express from 'express';
import { BACKEND_URL, PORT, fileFolder } from './common/common.constants';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  if (process.env.NODE_ENV === 'dev') {
    if (!fs.existsSync(fileFolder)) fs.mkdirSync(fileFolder);
  }
  app.useGlobalPipes(new ValidationPipe());
  app.use(graphqlUploadExpress({ maxFileSize: 1000000, maxFiles: 10 }));
  app.use('/files', express.static(join(__dirname, '../files')));
  app.enableCors();
  const start = () => console.log(`Server Start! ${BACKEND_URL}`);
  await app.listen(PORT, start);
}

bootstrap();
