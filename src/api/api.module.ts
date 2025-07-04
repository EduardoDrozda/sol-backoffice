import { Module } from '@nestjs/common';
import { AuthController, UserController } from './controllers';
import { UseCasesModule } from '@application/use-cases';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from '@infrastructure/interceptors';
import { AuthenticationModule } from '@common/authentication';
import { ExpenseCategoryController } from './controllers/expense-category.controller';
import { CostCenterController } from './controllers/cost-center.controller';
import { GroupController } from './controllers/group.controller';

@Module({
  imports: [UseCasesModule, AuthenticationModule],
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
