import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import * as morgan from "morgan";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  const logger = morgan("dev");
  app.use(logger);
  const PORT = 5000;
  const start = () => console.log(`Server Start! http://localhost:${PORT}`);
  await app.listen(PORT, start);
}

bootstrap();
