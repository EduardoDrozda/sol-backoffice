import { CreateRoleInput, RoleModel, RoleWithPermissions, UpdateRoleInput } from "@domain/models";

export const ROLE_REPOSITORY = Symbol('IRoleRepository');

export interface IRoleRepository {
  findById(id: string, includePermissions?: boolean): Promise<RoleModel | RoleWithPermissions | null>;
  findByName(name: string, includePermissions?: boolean): Promise<RoleModel | RoleWithPermissions | null>;
  findAll(includePermissions?: boolean): Promise<RoleModel[] | RoleWithPermissions[]>;
  create(data: CreateRoleInput): Promise<RoleWithPermissions>;
  update(id: string, data: UpdateRoleInput): Promise<RoleWithPermissions>;
  delete(id: string): Promise<void>;
  updateRolePermissions(roleId: string, permissionIds: string[]): Promise<void>;
}