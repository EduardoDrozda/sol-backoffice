import { HashModule } from '@common/hash';
import { LoggerModule } from '@common/logger';
import { Module } from '@nestjs/common';
import { AuthenticationModule } from '@common/authentication';
import { RepositoriesModule } from '@infrastructure/repositories';
import { ContextModule } from '@common/context/context.module';

import { USER_USE_CASES } from './user';
import { AUTH_USE_CASES } from './auth';
import { EXPENSE_CATEGORY_USE_CASES } from './expense-category';
import { COST_CENTER_USE_CASES } from './cost-center';
import { GROUP_USE_CASES } from './group';
import { PROJECT_USE_CASES } from './project';

@Module({
  imports: [
    LoggerModule,
    HashModule,
    AuthenticationModule,
    RepositoriesModule,
    ContextModule,
  ],
  providers: [
    ...USER_USE_CASES,
    ...AUTH_USE_CASES,
    ...EXPENSE_CATEGORY_USE_CASES,
    ...COST_CENTER_USE_CASES,
    ...GROUP_USE_CASES,
    ...PROJECT_USE_CASES,
  ],
  exports: [
    ...USER_USE_CASES,
    ...AUTH_USE_CASES,
    ...EXPENSE_CATEGORY_USE_CASES,
    ...COST_CENTER_USE_CASES,
    ...GROUP_USE_CASES,
    ...PROJECT_USE_CASES,
  ],
})
export class UseCasesModule {}
