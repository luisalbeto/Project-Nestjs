import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Inject } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(@Inject(JwtService) private jwtService: JwtService) {}
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const accessToken = request.cookies['accessToken']; // Leer token de la cookie
    if (!accessToken) {
      throw new UnauthorizedException('No autorizado');
    }
    try {
      const decoded = this.jwtService.verify(accessToken);
      request.user = decoded; // Guarda el usuario en la request
      return true;
    } catch (error) {
      throw new UnauthorizedException('Token inválido');
    }
  }
}