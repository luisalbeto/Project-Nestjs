import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UsersModule } from '../users/users.module';
@Module({
  imports: [
    UsersModule, // Asegúrate de importar UsersModule si lo usas en AuthService
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Usa variables de entorno
      signOptions: { expiresIn: '1h' }, 
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard], // Asegúrate de registrar JwtAuthGuard
  exports: [AuthService, JwtAuthGuard, JwtModule], // Exporta JwtModule para usarlo en otros módulos
})
export class AuthModule {}