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
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.validateUser(body.email, body.password);
    const tokens = await this.authService.login(user);

    response.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: false,
      maxAge: 15 * 60 * 1000, // 15 minutos
      sameSite: 'strict',
    });

    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
      sameSite: 'strict',
    });

    return { message: 'Login exitoso', user };
  }

  @Post('refresh-token')
  async refresh(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const refreshToken = request.cookies['refreshToken'];
    if (!refreshToken) {
      throw new UnauthorizedException('No se encontró el refresh token');
    }

    try {
      const newTokens = await this.authService.refreshAccessToken(refreshToken);
      response.cookie('accessToken', newTokens.accessToken, {
        httpOnly: true,
        secure: false,
        maxAge: 15 * 60 * 1000, // 15 minutos
        sameSite: 'strict',
      });
      return { message: 'Access token actualizado' };
    } catch (error) {
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('accessToken');
    response.clearCookie('refreshToken');
    return { message: 'Logout exitoso' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: Request) {
    return req.user;
  }
}