import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  HttpStatus,
  UnauthorizedException,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Response, Request } from 'express';
import { JwtService } from '@nestjs/jwt';  // IMPORTANTE: Asegúrate de importar el JwtService

import { JwtAuthGuard } from './jwt-auth.guard';  // Asegúrate de importar el guard correspondiente

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,  // Inyecta el JwtService aquí
  ) {}

  // :marca_de_verificación_blanca: Registro de usuario
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // :marca_de_verificación_blanca: Login (Ahora guarda el accessToken en una cookie)
  @Post("login")
  async login(
    @Body() body: { email: string; password: string },
    @Res({ passthrough: true }) response: Response
  ) {
    response.header("Access-Control-Allow-Origin", "http://localhost:5173");
    response.header("Access-Control-Allow-Credentials", "true");

    const user = await this.authService.validateUser(body.email, body.password);
    const tokens = await this.authService.login(user);

    response.cookie("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: false,
      maxAge: 15 * 60 * 1000, // 15 minutos
    });
    response.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    });

    return { message: "Login exitoso", user };
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
      secure: false,
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
  async getProfile(@Req() req: Request) {
    const token = req.cookies['accessToken'];

    if (!token) {
      return null; // Si no hay token, devuelves null o alguna señal de que no está autenticado
    }

    // Verifica si el token es válido
    try {
      const payload = this.jwtService.verify(token);  // Aquí verificamos el token con jwtService
      const user = await this.usersService.findById(payload.sub);  // Extraemos el usuario
      return user;  // Retornamos el usuario si es válido
    } catch (error) {
      return null; // Si el token es inválido, lo manejamos y retornamos null
    }
  }
}
