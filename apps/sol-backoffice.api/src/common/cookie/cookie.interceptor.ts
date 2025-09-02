import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable, tap } from 'rxjs';
import { CookieService } from './cookie.service';
import { Response } from 'express';

@Injectable()
export class CookieInterceptor implements NestInterceptor {
  constructor(private readonly cookieService: CookieService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const url = context.switchToHttp().getRequest().url as string;

    if (!url.startsWith('/api/v1/login')) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse<Response>();
        const { name, value, options } = this.cookieService.getCookieConfig(
          data.token,
        );
        response.cookie(name, value, options);
      }),
    );
  }
}
