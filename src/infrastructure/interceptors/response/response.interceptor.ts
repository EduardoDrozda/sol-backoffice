import { IBaseResponse } from '@domain/interfaces/general/base-response';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const url = context.switchToHttp().getRequest().url as string;

    if (url.startsWith('/health')) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => {
        const responseBody: IBaseResponse = {
          error: false,
          result: data,
        };

        return responseBody;
      }),
    );
  }
}
