import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module'; // Importa el UsersModule

@Module({
  imports: [
    UsersModule, // Asegúrate de importar el módulo de usuarios aquí
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Cambia esto por una clave más segura
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
