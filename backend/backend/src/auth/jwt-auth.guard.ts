import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Inject } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(@Inject(JwtService) private jwtService: JwtService) {}
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    console.log('Cookies en la petición:', request.cookies); // <--- Debug cookies
    const accessToken = request.cookies['accessToken'];
    console.log('Token encontrado:', accessToken); // <--- Debug token
    // Leer token de la cookie
    if (!accessToken) {
      throw new UnauthorizedException('No autorizado');
    }
    try {
      const decoded = this.jwtService.verify(accessToken);
      request.user = decoded; // Guarda el usuario en la request
      console.log('Usuario autenticado:', decoded); // <-- Agrega esto
      return true;
    } catch (error) {
      console.error('Error verificando token:', error); // <--- Debug error JWT

      throw new UnauthorizedException('Token inválido');
    }
  }
}