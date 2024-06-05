import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { CustomLoggerService } from 'src/shared/config/log';

/**
 * The bootstrap function is the entry point of the application.
 * It creates an instance of the Nest application and starts the server.
 * The application listens on port 3000 by default.
 * The application uses the ValidationPipe to validate the incoming data.
 * The application uses the CustomLoggerService to log messages.
 * The application sets the global prefix to 'api'.
 */
async function bootstrap() {
  async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
      logger: new CustomLoggerService(),
    });
    app.setGlobalPrefix('api');

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.listen(3000);
    Logger.warn(`Server running on http://localhost:3000`);
  }
  bootstrap();
}
bootstrap();
