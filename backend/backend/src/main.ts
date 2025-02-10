import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS
  app.enableCors({
    origin: 'http://localhost:5173', // Asegúrate de que sea la URL exacta del frontend
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"], // Permitir cookies y encabezados de autenticación
  });
  

  app.use(cookieParser())

  await app.listen(3000);
}
bootstrap();
