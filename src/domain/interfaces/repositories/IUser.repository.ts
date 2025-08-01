import { CreateUserInput, CreateUserTokenInput, UserTokenModel, UserWithRelations } from '@domain/models';
import { UserModel } from '@domain/models';
import { PrismaClient } from '@prisma/client';

export const USER_REPOSITORY = Symbol('IUserRepository');

export interface IUserRepositoryFindByEmailParams {
  includeRole?: boolean;
  includeCompany?: boolean;
  includePermissions?: boolean;
  includeCostCenters?: boolean;
  includeExpenseCategories?: boolean;
  includeGroups?: boolean;
  includeUserTokens?: boolean;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  page?: number;
  limit?: number;
}

export interface IUserRepositoryFindAllResult {
  data: UserWithRelations[];
  total: number;
}

export interface IUserRepository {
  findByEmail(email: string, params?: IUserRepositoryFindByEmailParams): Promise<UserWithRelations | null>;
  create(user: CreateUserInput): Promise<UserModel>;
  findById(id: string, params?: IUserRepositoryFindByEmailParams): Promise<UserWithRelations | null>;
  findAll(params?: IUserRepositoryFindByEmailParams): Promise<IUserRepositoryFindAllResult>;
  findByUserToken(token: string): Promise<UserTokenModel | null>;
  activateUser(id: string): Promise<void>;
  deactivateUser(id: string): Promise<void>;
  createUserToken(data: CreateUserTokenInput): Promise<UserTokenModel>;
  updatePassword(id: string, password: string): Promise<void>;
  deleteUserToken(token: string): Promise<void>;
}
