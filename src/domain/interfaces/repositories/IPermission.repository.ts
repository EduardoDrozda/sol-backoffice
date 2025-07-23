import { CreatePermissionInput, PermissionModel, UpdatePermissionInput } from "@domain/models";

export const PERMISSION_REPOSITORY = Symbol('IPermissionRepository');

export interface IPermissionRepository {
  findById(id: string): Promise<PermissionModel | null>;
  findByName(name: string): Promise<PermissionModel | null>;
  findAll(): Promise<PermissionModel[]>;
  create(data: CreatePermissionInput): Promise<PermissionModel>;
  update(id: string, data: UpdatePermissionInput): Promise<PermissionModel>;
  delete(id: string): Promise<void>;
} 