import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';
import { User } from 'src/core/auth/entities/user.entity';

export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const user: User = req.user;

    if (!user) {
      throw new InternalServerErrorException('User not found (request)');
    }

    // if (Object.keys(user).includes(data)) {
    //   return user[data];
    // }

    return !data ? user : user[data];
  },
);
