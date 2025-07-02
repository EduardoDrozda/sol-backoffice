import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type LoggedUserInfo = {
  id: string;
  companyId: string;
  role: string;
};

export const LoggedUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): LoggedUserInfo => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
