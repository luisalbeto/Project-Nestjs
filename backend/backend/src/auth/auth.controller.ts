import {
  Controller, Post, Body, Res, Req, HttpStatus,
  UnauthorizedException, Get, UseGuards
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Response, Request } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}
  // :marca_de_verificación_blanca: Registro de usuario
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  // :marca_de_verificación_blanca: Login (Ahora guarda el accessToken en una cookie)
  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.validateUser(body.email, body.password);
    const tokens = await this.authService.login(user);
    // Establecer cookies seguras HTTP-Only
    response.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000, // 15 minutos
    });
    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    });
    return { message: 'Login exitoso' };
  }
  // Refresh Token (Ahora devuelve una nueva cookie con el accessToken)
  @Post('refresh-token')
  async refresh(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const refreshToken = request.cookies['refreshToken'];
    if (!refreshToken) {
      throw new UnauthorizedException('No se encontró el refresh token');
    }
    const newTokens = await this.authService.refreshAccessToken(refreshToken);
    // Actualizar el accessToken en una nueva cookie
    response.cookie('accessToken', newTokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000, // 15 minutos
    });
    return { message: 'Access token actualizado' };
  }
  // Logout (Ahora limpia ambas cookies)
  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('accessToken');
    response.clearCookie('refreshToken');
    return { message: 'Logout exitoso' };
  }
  // Endpoint para obtener el usuario autenticado
  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req: Request) {
    console.log('Cookies:', req.cookies); // Imprime las cookies
    console.log('User from JWT:', req.user); // Información del usuario
    return req.user;
  }
}