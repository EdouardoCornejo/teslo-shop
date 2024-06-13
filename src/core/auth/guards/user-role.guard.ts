import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User } from 'src/core/auth/entities/user.entity';
import { META_ROLES } from '../decorators/role-protected/role-protected.decorator';

/**
 * Guard responsible for handling user role based authorization.
 */
@Injectable()
export class UserRoleGuard implements CanActivate {
  /**
   * Constructor
   * @param reflector
   */
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRole: string[] = this.reflector.get<string[]>(
      META_ROLES,
      context.getHandler(),
    );

    if (!validRole) return true;
    if (!validRole.length) return true;

    // if (!validRole || !validRole.length) {
    //   return true;
    // }

    console.log('🚀 ~ UserRoleGuard ~ validRole:', validRole);

    const req = context.switchToHttp().getRequest();
    const user = req.user as User;

    if (!user) {
      throw new BadRequestException('User not found');
    }

    for (const role of user.roles) {
      if (validRole.includes(role)) {
        return true;
      }
    }

    throw new ForbiddenException(
      `Unauthorized access, required roles: ${validRole}`,
    );
  }
}
