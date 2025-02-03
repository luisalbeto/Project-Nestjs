import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module'; // Importa PrismaModule
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Importamos JwtAuthGuard
import { AuthModule } from '../auth/auth.module'; // Importamos AuthModule
@Module({
  imports: [
    PrismaModule,
    forwardRef(() => AuthModule), // Usamos forwardRef para evitar dependencia circular
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtAuthGuard],
  exports: [UsersService], // Exporta UsersService para que otros módulos puedan usarlo
})
export class UsersModule {}