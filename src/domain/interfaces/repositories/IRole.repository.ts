import { RoleModel } from "@domain/models";

export const ROLE_REPOSITORY = Symbol('IRoleRepository');

export interface IRoleRepository {
  findById(id: string, includePermissions?: boolean): Promise<RoleModel | null>;
  findByName(name: string, includePermissions?: boolean): Promise<RoleModel | null>;
}