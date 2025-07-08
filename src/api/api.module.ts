import { Module } from '@nestjs/common';
import { AuthController, UserController } from './controllers';
import { UseCasesModule } from '@application/use-cases';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from '@infrastructure/interceptors';
import { AuthenticationModule } from '@common/authentication';
import { ExpenseCategoryController } from './controllers/expense-category.controller';
import { CostCenterController } from './controllers/cost-center.controller';
import { GroupController } from './controllers/group.controller';
import { EnviromentModule } from '@common/enviroment';
import { CookieModule } from '@common/cookie/cookie.module';

@Module({
  imports: [UseCasesModule, AuthenticationModule, CookieModule, EnviromentModule],
  controllers: [
    UserController,
    AuthController,
    ExpenseCategoryController,
    CostCenterController,
    GroupController
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor
    }
  ]
})
export class ApiModule { }
