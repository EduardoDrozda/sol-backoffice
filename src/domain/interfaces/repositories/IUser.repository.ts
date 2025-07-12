import { CreateUserInput, UserWithRelations } from '@domain/models';
import { UserModel } from '@domain/models';

export const USER_REPOSITORY = Symbol('IUserRepository');

export interface IUserRepositoryFindByEmailParams {
  includeRole?: boolean;
  includeCompany?: boolean;
  includePermissions?: boolean;
  includeCostCenters?: boolean;
  includeExpenseCategories?: boolean;
  includeGroups?: boolean;
}

export interface IUserRepository {
  findByEmail(email: string, params?: IUserRepositoryFindByEmailParams): Promise<UserWithRelations | null>;
  create(user: CreateUserInput): Promise<UserModel>;
  findById(id: string, params?: IUserRepositoryFindByEmailParams): Promise<UserWithRelations | null>;
}
