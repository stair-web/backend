import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { isNullOrUndefined } from 'src/lib/utils/util';
import { User } from './user.entity';

export const GetUser = createParamDecorator(
  (data, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
