import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { User } from '@prisma/client';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          // Intentamos obtener el token de las cookies
          return req.cookies ? req.cookies['accessToken'] : null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secretKey',
    });
  }
  async validate(payload: any): Promise<User> {
    const userId = Number(payload.sub);
    if (isNaN(userId)) {
      throw new UnauthorizedException('Token inválido: ID de usuario no válido');
    }
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
    return user; // Devuelve el usuario autenticado
  }
}

















