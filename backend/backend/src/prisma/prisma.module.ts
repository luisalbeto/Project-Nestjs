import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Esto hace que el módulo sea accesible en toda la aplicación
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Exporta PrismaService para que otros módulos puedan usarlo
})
export class PrismaModule {}
