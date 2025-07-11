import {
  COST_CENTER_REPOSITORY,
  EXPENSE_CATEGORY_REPOSITORY,
  GROUP_REPOSITORY,
  ROLE_REPOSITORY,
  USER_REPOSITORY,
} from '@domain/interfaces/repositories';
import { Global, Module } from '@nestjs/common';
import { DatabaseModule } from '@infrastructure/database';
import { ExpenseCategoryRepository } from './expense-category.repository';
import { UserRepository } from './user.repository';
import { CostCenterRepository } from './cost-center.repository';
import { GroupRepository } from './group.repository';
import { RoleRepository } from './role.repository';

@Global()
@Module({
  imports: [DatabaseModule],
  providers: [
    {
      provide: ROLE_REPOSITORY,
      useClass: RoleRepository,
    },
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    {
      provide: EXPENSE_CATEGORY_REPOSITORY,
      useClass: ExpenseCategoryRepository,
    },
    {
      provide: COST_CENTER_REPOSITORY,
      useClass: CostCenterRepository,
    },
    {
      provide: GROUP_REPOSITORY,
      useClass: GroupRepository,
    },
  ],
  exports: [
    USER_REPOSITORY,
    EXPENSE_CATEGORY_REPOSITORY,
    COST_CENTER_REPOSITORY,
    GROUP_REPOSITORY,
    ROLE_REPOSITORY,
  ],
})
export class RepositoriesModule {}
