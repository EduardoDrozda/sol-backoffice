import { HashModule } from '@common/hash';
import { LoggerModule } from '@common/logger';
import { Module } from '@nestjs/common';
import { AuthenticationModule } from '@common/authentication';
import { RepositoriesModule } from '@infrastructure/repositories';
import { ContextModule } from '@common/context/context.module';

import { USER_USE_CASES } from './user';
import { AUTH_USE_CASES } from './auth';

@Module({
  imports: [
    LoggerModule, 
    HashModule, 
    AuthenticationModule,
    RepositoriesModule,
    ContextModule
  ],
  providers: [...USER_USE_CASES, ...AUTH_USE_CASES],
  exports: [...USER_USE_CASES, ...AUTH_USE_CASES],
})
export class UseCasesModule {}
