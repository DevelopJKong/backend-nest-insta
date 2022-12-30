import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';
import * as fs from 'fs';
import * as express from 'express';
import { fileFolder } from './common/common.constants';
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
  const PORT = 5000;
  const start = () => console.log(`Server Start! http://localhost:${PORT}`);
  await app.listen(PORT, start);
}

bootstrap();
