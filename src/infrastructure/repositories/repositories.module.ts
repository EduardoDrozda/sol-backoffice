import {
  COST_CENTER_REPOSITORY,
  EXPENSE_CATEGORY_REPOSITORY,
  EXPENSE_REPOSITORY,
  GROUP_REPOSITORY,
  PERMISSION_REPOSITORY,
  PROJECT_REPOSITORY,
  ROLE_REPOSITORY,
  USER_REPOSITORY,
} from '@domain/interfaces/repositories';

import { Global, Module } from '@nestjs/common';
import { DatabaseModule } from '@infrastructure/database';
import { ExpenseCategoryRepository } from './expense-category.repository';
import { UserRepository } from './user.repository';
import { CostCenterRepository } from './cost-center.repository';
import { GroupRepository } from './group.repository';
import { ProjectRepository } from './project.repository';
import { RoleRepository } from './role.repository';
import { PermissionRepository } from './permission.repository';
import { ExpenseRepository } from './expense.repository';

@Global()
@Module({
  imports: [DatabaseModule],
  providers: [
    {
      provide: ROLE_REPOSITORY,
      useClass: RoleRepository,
    },
    {
      provide: PERMISSION_REPOSITORY,
      useClass: PermissionRepository,
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
    {
      provide: PROJECT_REPOSITORY,
      useClass: ProjectRepository,
    },
    {
      provide: EXPENSE_REPOSITORY,
      useClass: ExpenseRepository,
    },
  ],
  exports: [
    USER_REPOSITORY,
    EXPENSE_CATEGORY_REPOSITORY,
    COST_CENTER_REPOSITORY,
    GROUP_REPOSITORY,
    PROJECT_REPOSITORY,
    ROLE_REPOSITORY,
    PERMISSION_REPOSITORY,
    EXPENSE_REPOSITORY,
  ],
})
export class RepositoriesModule {}
