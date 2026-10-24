import { ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from 'src/core/auth/guards/user-role.guard';

/**
 * Guard responsible for protecting the seed endpoint.
 * Outside production the seed is open, so an empty database can be bootstrapped
 * (the seed itself creates the first admin user). In production it requires a
 * valid JWT and the roles declared with `@RoleProtected`.
 */
@Injectable()
export class SeedAccessGuard extends AuthGuard('jwt') {
  private readonly userRoleGuard: UserRoleGuard;

  /**
   * Constructor
   * @param configService
   * @param reflector
   */
  constructor(
    private readonly configService: ConfigService,
    reflector: Reflector,
  ) {
    super();
    this.userRoleGuard = new UserRoleGuard(reflector);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.configService.get<string>('NODE_ENV') !== 'production') {
      return true;
    }

    const isAuthenticated = (await super.canActivate(context)) as boolean;
    if (!isAuthenticated) return false;

    return this.userRoleGuard.canActivate(context) as boolean;
  }
}
