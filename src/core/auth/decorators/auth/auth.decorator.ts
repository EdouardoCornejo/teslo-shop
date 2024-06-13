import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ValidRoles } from 'src/common/interface';
import { RoleProtected } from 'src/core/auth/decorators/role-protected';
import { UserRoleGuard } from 'src/core/auth/guards/user-role.guard';

export function Auth(...roles: ValidRoles[]) {
  return applyDecorators(
    RoleProtected(...roles),
    UseGuards(AuthGuard(), UserRoleGuard),
  );
}
