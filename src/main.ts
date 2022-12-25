import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe(),
  );
  app.enableCors();
  const PORT = 5000;
  const start = () => console.log(`Server Start! http://localhost:${PORT}`);
  await app.listen(PORT, start);
}

bootstrap();
