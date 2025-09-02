import { Module } from '@nestjs/common';
import { CookieService } from './cookie.service';
import { EnviromentModule } from '@common/enviroment';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CookieInterceptor } from './cookie.interceptor';

@Module({
  imports: [EnviromentModule],
  providers: [
    CookieService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CookieInterceptor,
    },
  ],
  exports: [CookieService],
})
export class CookieModule {}
