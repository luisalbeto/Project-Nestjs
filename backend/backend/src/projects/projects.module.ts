import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module'; // Importamos AuthModule
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Importamos JwtAuthGuard
@Module({
  imports: [PrismaModule, AuthModule], // :apuntando_hacia_la_izquierda: Aseguramos importar AuthModule
  controllers: [ProjectsController],
  providers: [ProjectsService, JwtAuthGuard], // :apuntando_hacia_la_izquierda: Registramos JwtAuthGuard como provider
})
export class ProjectsModule {}