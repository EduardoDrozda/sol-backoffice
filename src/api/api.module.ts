import { Module } from '@nestjs/common';
import { AuthController, UserController } from './controllers';
import { UseCasesModule } from '@application/use-cases';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from '@infrastructure/interceptors';
import { AuthenticationModule } from '@common/authentication';
import { EmailModule } from '@common/email';
import { ExpenseCategoryController } from './controllers/expense-category.controller';
import { CostCenterController } from './controllers/cost-center.controller';
import { GroupController } from './controllers/group.controller';
import { ProjectController } from './controllers/project.controller';
import { EnviromentModule } from '@common/enviroment';
import { CookieModule } from '@common/cookie/cookie.module';
import { PermissionGuard } from '@infrastructure/guards/permission/permission.guard';

@Module({
  imports: [
    UseCasesModule,
    AuthenticationModule,
    CookieModule,
    EnviromentModule,
  ],
  controllers: [
    UserController,
    AuthController,
    ExpenseCategoryController,
    CostCenterController,
    GroupController,
    ProjectController,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
})
export class ApiModule {}
