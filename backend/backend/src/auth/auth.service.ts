import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    // Buscar al usuario por email
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Comparar la contraseña ingresada con la almacenada (hasheada)
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return user; // Retorna el usuario si las credenciales son válidas
  }


  async login(user: User) {
    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    
    // Aquí podrías guardar el refresh token en la base de datos si lo deseas
    await this.usersService.update(user.id, { refreshToken });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshAccessToken(refreshToken: string) {
    const payload = this.jwtService.verify(refreshToken); // Verifica el refresh token
    const user = await this.usersService.findOne(payload.sub);
    
    if (!user || user.refreshToken !== refreshToken) {
      throw new UnauthorizedException('Refresh token inválido');
    }

    const newAccessToken = this.jwtService.sign({ email: user.email, sub: user.id }, { expiresIn: '1h' });
    
    return {
      accessToken: newAccessToken,
    };
}

}
