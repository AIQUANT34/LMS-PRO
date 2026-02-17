import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get roles from @Roles()
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no role required → allow
    if (!requiredRoles) {
      return true;
    }

    // Get logged-in user
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // If no user → block
    if (!user) {
      return false;
    }

    // Check role
    return requiredRoles.includes(user.role);
  }
}