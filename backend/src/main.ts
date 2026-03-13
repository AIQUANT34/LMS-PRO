import * as express from 'express';
import * as path from 'path';

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set global configuration
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'protrain-secret-key-2024';
  
  // Enable CORS
  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix('api');

  // Serve static files
  app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
  app.use('/certificates', express.static(path.join(__dirname, '..', 'certificates')));

  // Enable global validation (for api i/p validation)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Add global exception filter to catch all 500 errors
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT ?? 3001);
  console.log('ProTrain Backend is running with CORS enabled and global error handling');
}
bootstrap();
