import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import cookieParser from "cookie-parser";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Trust proxy configuration for correct IP address retrieval
  app.getHttpAdapter().getInstance().set("trust proxy", true);

  // Static files hosting
  app.useStaticAssets(join(__dirname, "..", "uploads"), {
    prefix: "/static/",
  });

  // Global pipes
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  // Cookie parser
  app.use(cookieParser());

  // CORS configuration
  app.enableCors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  });
  app.setGlobalPrefix("api");

  // Swagger documentation TODO: Error with Transaction.status.PENDING circular dependencies nested objects
  // const config = new DocumentBuilder()
  //   .setTitle("StayWell API")
  //   .setDescription("API for StayWell")
  //   .setVersion("1.0")
  //   .addBearerAuth()
  //   .build();

  // const document = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup("api", app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
}

void bootstrap().catch((error) => {
  console.error("Error starting the application:", error);
  process.exit(1);
});
