import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { NextFunction, Request } from 'express';
import { ContextService } from '@common/context/context.service';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: AuthenticationService,
    private readonly contextService: ContextService,
  ) { }

  async use(req: Request, _: Response, next: NextFunction) {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];

    if (!token) {
      next();
      return;
    }

    try {
      const payload = await this.jwtService.verify(token);
      req.user = payload as { id: string; role: string; companyId: string };

      this.contextService.run({
        companyId: payload.companyId,
        id: payload.id,
        role: payload.role,
      }, () => next());
    } catch {
      next();
    }
  }
}
