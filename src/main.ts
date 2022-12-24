import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = 5000;
  const logger = morgan('dev');
  app.use(logger);
  await app.listen(PORT);
  console.log(`Application is running on: 🎁 http://localhost:${PORT}`);
}
bootstrap();
