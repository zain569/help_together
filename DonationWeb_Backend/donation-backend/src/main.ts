import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true, // Enable raw body parsing for Stripe webhook
  });
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true
  }));

  app.use(cookieParser());
  app.enableCors({
    origin: ['http://localhost:5173'],
      credentials: true
  });
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');

}
await bootstrap();
