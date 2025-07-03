import { EXPENSE_CATEGORY_REPOSITORY, USER_REPOSITORY } from '@domain/interfaces/repositories';
import { Global, Module } from '@nestjs/common';
import { DatabaseModule } from '@infrastructure/database';
import { ExpenseCategoryRepository } from './expense-category.repository';
import { UserRepository } from './user.repository';

@Global()
@Module({
  imports: [DatabaseModule],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository
    },
    {
      provide: EXPENSE_CATEGORY_REPOSITORY,
      useClass: ExpenseCategoryRepository
    }
  ],
  exports: [USER_REPOSITORY, EXPENSE_CATEGORY_REPOSITORY]
})
export class RepositoriesModule { }
