import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { NextFunction, Request } from 'express';
import { ContextService } from '@common/context/context.service';
import { EnviromentService } from '@common/enviroment';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: AuthenticationService,
    private readonly contextService: ContextService,
    private readonly enviroment: EnviromentService,
  ) {}

  async use(req: Request, _: Response, next: NextFunction) {
    const token = req.cookies[this.enviroment.get('COOKIE_NAME')];

    if (!token) {
      next();
      return;
    }

    try {
      const payload = await this.jwtService.verify(token);
      req.user = payload as { id: string; role: string; companyId: string };

      this.contextService.run(
        {
          companyId: payload.companyId,
          id: payload.id,
          role: payload.role,
        },
        () => next(),
      );
    } catch {
      next();
    }
  }
}
