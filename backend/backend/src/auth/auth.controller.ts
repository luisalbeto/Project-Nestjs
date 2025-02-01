import { Controller, Post, Body, Res, Req, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Response, Request } from 'express'; // Importa Request y Response

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    // No devolver la contraseña en la respuesta
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword; // Retorna el usuario sin la contraseña
  }

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.validateUser(body.email, body.password);
    
    const tokens = await this.authService.login(user);
    
    // Establecer el refresh token en una cookie HTTP-Only
    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Usa cookies seguras en producción
      maxAge: 7 * 24 * 60 * 60 * 1000, // Expira en 7 días
    });

    return {
      accessToken: tokens.accessToken,
    };
  }

  @Post('refresh-token')
  async refresh(@Req() request: Request) {
    const refreshToken = request.cookies['refreshToken']; // Obtén el refresh token desde las cookies
    if (!refreshToken) {
      throw new UnauthorizedException('No se encontró el refresh token');
    }

    const newTokens = await this.authService.refreshAccessToken(refreshToken);
    
    return newTokens; // Devuelve el nuevo access token
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('refreshToken'); // Limpiar la cookie del refresh token
    return { message: 'Logout exitoso' };
  }
}
