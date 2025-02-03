import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { AuthModule } from '../auth/auth.module'; // Importamos AuthModule
import { PrismaModule } from '../prisma/prisma.module'; // Asegúrate de importar PrismaModule
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Importamos JwtAuthGuard


@Module({
  imports: [PrismaModule,AuthModule], // Importa PrismaModule para usar PrismaService
  controllers: [TasksController],
  providers: [TasksService, JwtAuthGuard],
})
export class TasksModule {}
