import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() body: any) {
    // Implementa la lógica para registrar un nuevo usuario
  }

  @Post('refresh-token')
  async refreshToken(@Body() body: any) {
    // Implementa la lógica para refrescar el token
  }

  @Post('logout')
  async logout(@Body() body: any) {
    // Implementa la lógica para cerrar sesión
  }
}
