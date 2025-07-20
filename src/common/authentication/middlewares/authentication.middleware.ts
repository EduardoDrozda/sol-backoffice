import { Injectable, NestMiddleware } from '@nestjs/common';
import { AuthenticationService } from '../authentication.service';
import { EnviromentService } from '@common/enviroment';
import { NextFunction, Request } from 'express';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly enviroment: EnviromentService,
  ) {}

  async use(req: Request, _: Response, next: NextFunction) {
    const token = req.cookies[this.enviroment.get('COOKIE_NAME')];

    if (!token) {
      next();
      return;
    }

    try {
      const payload = await this.authenticationService.verify(token);
      req.user = payload as { id: string; role: string; companyId: string };

      this.authenticationService.run(
        {
          user: {
            companyId: payload.companyId,
            id: payload.id,
            roleId: payload.roleId,
          },
        },
        () => next(),
      );
    } catch {
      next();
    }
  }
}
