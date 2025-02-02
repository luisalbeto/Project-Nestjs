import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS
  app.enableCors({
    origin: 'http://localhost:5173', // Cambia esto al dominio de tu frontend
    credentials: true, // Permitir cookies y encabezados de autenticación
  });

  await app.listen(3000);
}
bootstrap();
