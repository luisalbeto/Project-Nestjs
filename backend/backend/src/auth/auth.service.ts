import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service'; // Asegúrate de importar el servicio de usuarios
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client'; // Importa el modelo User de Prisma
import * as bcrypt from 'bcryptjs'; // Para manejar la comparación de contraseñas

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email); // Asegúrate de tener este método en UsersService
    if (user && await bcrypt.compare(password, user.password)) { // Compara la contraseña hasheada
      return user;
    }
    throw new UnauthorizedException('Credenciales inválidas');
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
