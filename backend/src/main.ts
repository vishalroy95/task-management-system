import { Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "./common/filters/all-exceptions.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.getOrThrow<number>("app.port");
  const frontendOrigin = configService.getOrThrow<string>("app.frontendOrigin");

  app.setGlobalPrefix("api");
  app.enableCors({
    credentials: true,
    origin: frontendOrigin,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
      whitelist: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(port);
  Logger.log(`API listening on http://localhost:${port}/api`, "Bootstrap");
}

void bootstrap();
