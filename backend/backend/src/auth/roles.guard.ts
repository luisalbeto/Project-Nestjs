import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());
    if (!requiredRoles) {
      return true; // Si no hay roles requeridos, permite acceso
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; // El usuario debe estar disponible en la solicitud (agregado por JwtAuthGuard)

    return requiredRoles.some((role) => user.role === role); // Verifica si el rol del usuario coincide con alguno requerido
  }
}
