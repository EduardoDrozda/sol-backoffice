import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { EnviromentModule, EnviromentService } from '@common/enviroment';
import { ContextModule } from '@common/context/context.module';
import { AuthenticationMiddleware } from './authentication.middleware';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from './authentication.guard';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [EnviromentModule],
      useFactory: (envService: EnviromentService) => ({
        secret: envService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: envService.get('COOKIE_MAX_AGE'),
        },
      }),
      inject: [EnviromentService],
    }),
    EnviromentModule,
    ContextModule,
  ],
  providers: [
    {
      provide: AuthenticationService,
      useFactory: (jwtService: JwtService, envService: EnviromentService) =>
        new AuthenticationService(
          {
            secret: envService.get('JWT_SECRET'),
          },
          jwtService,
        ),
      inject: [JwtService, EnviromentService],
    },
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
  ],
  exports: [AuthenticationService],
})
export class AuthenticationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes('*splat');
  }
}
