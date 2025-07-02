import { USER_REPOSITORY } from '@domain/interfaces/repositories';
import { Global, Module } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { DatabaseModule } from '@infrastructure/database';

@Global()
@Module({
  imports: [DatabaseModule],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository
    },
  ],
  exports: [USER_REPOSITORY]
})
export class RepositoriesModule { }
