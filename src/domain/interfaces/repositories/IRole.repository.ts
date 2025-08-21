import { CreateRoleInput, RoleModel, RoleWithPermissions, UpdateRoleInput } from "@domain/models";

export const ROLE_REPOSITORY = Symbol('IRoleRepository');

export interface IRoleRepositoryFindAllParams {
  includePermissions?: boolean;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  page?: number;
  limit?: number;
}

export interface IRoleRepositoryFindAllResult {
  data: RoleModel[] | RoleWithPermissions[];
  total: number;
}

export interface IRoleRepository {
  findById(id: string, includePermissions?: boolean): Promise<RoleModel | RoleWithPermissions | null>;
  findByName(name: string, includePermissions?: boolean): Promise<RoleModel | RoleWithPermissions | null>;
  findAll(params?: IRoleRepositoryFindAllParams): Promise<IRoleRepositoryFindAllResult>;
  findAllSimple(): Promise<RoleModel[] | RoleWithPermissions[]>;
  create(data: CreateRoleInput): Promise<RoleWithPermissions>;
  update(id: string, data: UpdateRoleInput): Promise<RoleWithPermissions>;
  delete(id: string): Promise<void>;
  updateRolePermissions(roleId: string, permissionIds: string[]): Promise<void>;
}