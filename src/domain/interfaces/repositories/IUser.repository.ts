import { CreateUserInput, CreateUserTokenInput, UserTokenModel, UserWithRelations } from '@domain/models';
import { UserModel } from '@domain/models';
import { PrismaClient } from '@prisma/client';

export const USER_REPOSITORY = Symbol('IUserRepository');

export interface IUserRepositoryFindParams {
  includeRole?: boolean;
  includeCompany?: boolean;
  includePermissions?: boolean;
  includeCostCenters?: boolean;
  includeExpenseCategories?: boolean;
  includeGroups?: boolean;
  includeUserTokens?: boolean;  
}

export interface IUserRepositoryFindPaginatedParams extends IUserRepositoryFindParams {
  page: number;
  limit: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface IUserRepositoryFindAllResult {
  data: UserWithRelations[];
  total: number;
}

export interface IUserRepository {
  findByEmail(email: string, params?: IUserRepositoryFindParams): Promise<UserWithRelations | null>;
  create(user: CreateUserInput): Promise<UserModel>;
  findById(id: string, params?: IUserRepositoryFindParams): Promise<UserWithRelations | null>;
  findAll(params?: IUserRepositoryFindPaginatedParams): Promise<IUserRepositoryFindAllResult>;
  findByUserToken(token: string): Promise<UserTokenModel | null>;
  activateUser(id: string): Promise<void>;
  deactivateUser(id: string): Promise<void>;
  createUserToken(data: CreateUserTokenInput): Promise<UserTokenModel>;
  updatePassword(id: string, password: string): Promise<void>;
  deleteUserToken(token: string): Promise<void>;
  deleteUserTokensByUserIdAndType(userId: string, type: string): Promise<void>;
}
