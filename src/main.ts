<<<<<<< HEAD
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
=======
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe(),
  );
>>>>>>> bba244e4316370d6ff519e72f0e31ce1a9583272
  app.enableCors();
  const PORT = 5000;
  const start = () => console.log(`Server Start! http://localhost:${PORT}`);
  await app.listen(PORT, start);
}

bootstrap();
