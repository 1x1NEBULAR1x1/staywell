import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AuthenticatedIoAdapter } from './lib/websocket/adapter';
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // WebSocket adapter
  app.useWebSocketAdapter(new AuthenticatedIoAdapter(app));

  // Trust proxy configuration for correct IP address retrieval
  app.getHttpAdapter().getInstance().set('trust proxy', true);

  // Static files hosting
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/static/',
  });

  // Global pipes
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  // Cookie parser
  app.use(cookieParser());

  // CORS configuration
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });
  app.setGlobalPrefix('api');

  // Swagger documentation - TODO: Fix circular dependency in Prisma models
  // const config = new DocumentBuilder()
  //   .setTitle('StayWell API')
  //   .setDescription('API for StayWell')
  //   .setVersion('1.0')
  //   .addBearerAuth()
  //   .build();

  // const document = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`✅ NestJS application startup completed`);
  console.log(`🚀 Server is running on: http://localhost:${port}`);
  console.log(`📡 API available at: http://localhost:${port}/api`);
  console.log(`🔌 WebSocket available at: ws://localhost:${port}`);
}

void bootstrap().catch((error) => {
  console.error('❌ Error starting the application:', error);
  process.exit(1);
});
