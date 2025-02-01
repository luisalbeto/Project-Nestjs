import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { PrismaModule } from '../prisma/prisma.module'; // Asegúrate de importar PrismaModule

@Module({
  imports: [PrismaModule], // Importa PrismaModule para usar PrismaService
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
