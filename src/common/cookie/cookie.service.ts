import { EnviromentService } from '@common/enviroment';
import { Injectable } from '@nestjs/common';
import { CookieOptions } from 'express';

@Injectable()
export class CookieService {
  constructor(private readonly env: EnviromentService) {}

  getCookieConfig(token: string): {
    name: string;
    value: string;
    options: CookieOptions;
  } {
    return {
      name: this.env.get('COOKIE_NAME'),
      value: token,
      options: {
        maxAge: parseInt(this.env.get('COOKIE_MAX_AGE'), 10),
        httpOnly: this.env.get('COOKIE_HTTP_ONLY') === 'true',
        secure: this.env.get('COOKIE_SECURE') === 'true',
        sameSite: this.env.get('COOKIE_SAME_SITE') as CookieOptions['sameSite'],
        path: this.env.get('COOKIE_PATH') || '/',
        domain: this.env.get('COOKIE_DOMAIN') || undefined,
      },
    };
  }
}
