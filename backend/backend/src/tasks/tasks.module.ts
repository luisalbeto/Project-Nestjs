import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { PrismaModule } from '../prisma/prisma.module'; // Asegúrate de importar PrismaModule

@Module({
  imports: [PrismaModule], // Importa PrismaModule para usar PrismaService
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
