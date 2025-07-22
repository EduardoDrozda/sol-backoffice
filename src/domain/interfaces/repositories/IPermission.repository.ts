import { CreatePermissionInput, PermissionModel } from "@domain/models";

export const PERMISSION_REPOSITORY = Symbol('IPermissionRepository');

export interface IPermissionRepository {
  findById(id: string): Promise<PermissionModel | null>;
  findByName(name: string): Promise<PermissionModel | null>;
  create(data: CreatePermissionInput): Promise<PermissionModel>;
} 