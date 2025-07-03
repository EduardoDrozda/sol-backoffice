import { Module } from '@nestjs/common';
import { AuthController, UserController } from './controllers';
import { UseCasesModule } from '@application/use-cases';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from '@infrastructure/interceptors';
import { AuthenticationModule } from '@common/authentication';
import { ExpenseCategoryController } from './controllers/expense-category.controller';

@Module({
  imports: [UseCasesModule, AuthenticationModule],
  controllers: [UserController, AuthController, ExpenseCategoryController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor
    }
  ]
})
export class ApiModule { }
