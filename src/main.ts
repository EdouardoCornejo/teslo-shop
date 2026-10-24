import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { CustomLoggerService } from 'src/shared/config/log';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * The bootstrap function is the entry point of the application.
 * It creates an instance of the Nest application and starts the server.
 * The application listens on port 3000 by default.
 * The application uses the ValidationPipe to validate the incoming data.
 * The application uses the CustomLoggerService to log messages.
 * The application sets the global prefix to 'api'.
 * The Swagger UI is served at /api/docs and the OpenAPI JSON at /api/docs-json.
 */
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

  const config = new DocumentBuilder()
    .setTitle('Teslo Shop API')
    .setDescription(
      [
        'REST API for a clothing store built with NestJS, TypeORM and PostgreSQL.',
        '',
        '**Authentication:** register or log in with `/api/auth/register` or `/api/auth/login`, copy the returned `token` and click **Authorize** to send it as `Authorization: Bearer <token>`.',
        '',
        '**Roles:** `user` (default on register), `admin` and `super-user`. Updating and deleting products requires `super-user`.',
        '',
        '**Seed:** `GET /api/seed` resets the database with an `admin@gmail.com` and a `super-user@gmail.com` user (password `Abc123456`) and 50+ products. It is open outside production.',
        '',
        '**Real time:** a Socket.IO server runs on the same port. Clients send the JWT in the `authentication` handshake header and use the `message-from-client`, `message-from-server` and `clients-updated` events (not described by OpenAPI).',
      ].join('\n'),
    )
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'JWT returned by /api/auth/login or /api/auth/register',
    })
    .addTag('Auth', 'Registration, login and token renewal')
    .addTag('Products', 'Product catalog: list, search, create, update, delete')
    .addTag('Files', 'Product image upload and download')
    .addTag('Seed', 'Reset the database with sample data')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Teslo Shop API docs',
    swaggerOptions: { persistAuthorization: true },
  });

  await app.listen(process.env.PORT || 3000);
  Logger.verbose(`Server running on http://localhost:${process.env.PORT}`);
}
bootstrap();
