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

  // ✅ Validar usuario en Login
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return user;
  }

  // ✅ Generar accessToken y refreshToken (con refreshToken hasheado)
  async login(user: User) {
    const payload = { email: user.email, sub: user.id, role:user.role };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    // 🔹 Hashear el refreshToken antes de guardarlo en la BD
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersService.update(user.id, { refreshToken: hashedRefreshToken });

    return { accessToken, refreshToken };
  }

  // ✅ Refrescar el accessToken de manera segura
  // auth.service.ts
async refreshAccessToken(refreshToken: string) {
  try {
    const payload = this.jwtService.verify(refreshToken); // Verifica si el token es válido
    const user = await this.usersService.findById(payload.sub);

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Usuario no encontrado o sin refresh token');
    }

    const isTokenValid = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isTokenValid) {
      await this.usersService.update(user.id, { refreshToken: null });
      throw new UnauthorizedException('Refresh token inválido');
    }

    const newAccessToken = this.jwtService.sign(
      { email: user.email, sub: user.id, role: user.role },
      { expiresIn: '1h' },
    );

    return { accessToken: newAccessToken };
  } catch (error) {
    throw new UnauthorizedException('Refresh token inválido o expirado');
  }
}


  // ✅ Logout: Eliminar el refreshToken de la base de datos
  async logout(userId: number) {
    await this.usersService.update(userId, { refreshToken: null });
    return { message: 'Logout exitoso' };
  }
}
