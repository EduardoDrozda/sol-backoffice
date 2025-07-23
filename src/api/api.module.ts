import { Module } from '@nestjs/common';
import { UseCasesModule } from '@application/use-cases';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from '@infrastructure/interceptors';
import { AuthenticationModule } from '@common/authentication';
import { EnviromentModule } from '@common/enviroment';
import { CookieModule } from '@common/cookie/cookie.module';
import { StorageModule } from '@infrastructure/storage/storage.module';

import {
  AuthController,
  ExpenseController,
  UserController,
  RoleController,
  ExpenseCategoryController,
  CostCenterController,
  GroupController,
  PermissionController,
  ProjectController,
} from './controllers';

@Module({
  imports: [
    UseCasesModule,
    AuthenticationModule,
    CookieModule,
    EnviromentModule,
    StorageModule,
  ],
  controllers: [
    UserController,
    AuthController,
    ExpenseCategoryController,
    CostCenterController,
    GroupController,
    PermissionController,
    ProjectController,
    RoleController,
    ExpenseController,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class ApiModule {}
