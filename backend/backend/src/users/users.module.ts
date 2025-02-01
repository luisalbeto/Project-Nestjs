import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module'; // Importa PrismaModule

@Module({
  imports: [PrismaModule], // Importa PrismaModule para usar PrismaService
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Exporta UsersService para que otros módulos puedan usarlo
})
export class UsersModule {}
