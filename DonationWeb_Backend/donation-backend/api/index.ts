import { NestFactory } from '@nestjs/core';
import type { Request, Response } from 'express';
import { AppModule } from '../src/app.module.js';

let handler: ((request: Request, response: Response) => unknown) | undefined;

async function createHandler() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });

  app.enableCors();
  await app.init();

  return app.getHttpAdapter().getInstance() as (
    request: Request,
    response: Response,
  ) => unknown;
}

export default async function vercelHandler(
  request: Request,
  response: Response,
) {
  handler ??= await createHandler();
  return handler(request, response);
}
