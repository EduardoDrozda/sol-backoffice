import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { EnviromentModule, EnviromentService } from '@common/enviroment';
import { AuthenticationMiddleware } from './middlewares/authentication.middleware';
import { APP_GUARD } from '@nestjs/core';
import { AuthorizationGuard } from './guards';


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
      useClass: AuthorizationGuard,
    },
  ],
  exports: [AuthenticationService],
})
export class AuthenticationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes('*splat');
  }
}
