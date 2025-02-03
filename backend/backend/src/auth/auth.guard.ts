import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UnauthorizedException } from '@nestjs/common';
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // Lógica adicional antes de llamar al guardia base
    return super.canActivate(context);
  }
  // Redefinimos el método para obtener el JWT desde las cookies
  getRequest(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    // Accedemos al token desde las cookies
    const token = request.cookies['accessToken'];
    // Si el token no está presente, lanzamos un error
    if (!token) {
      throw new UnauthorizedException('Token no encontrado');
    }
    // Asignamos el token al request para que el JWT Strategy pueda validarlo
    request.headers['authorization'] = `Bearer ${token}`;
    return request;
  }
}









