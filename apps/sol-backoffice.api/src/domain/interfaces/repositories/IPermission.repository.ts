import { CreatePermissionInput, PermissionModel, UpdatePermissionInput } from "@domain/models";

export const PERMISSION_REPOSITORY = Symbol('IPermissionRepository');

export interface IPermissionRepositoryFindAllParams {
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface IPermissionRepositoryFindAllResult {
  data: PermissionModel[];
  total: number;
}

export interface IPermissionRepository {
  findById(id: string): Promise<PermissionModel | null>;
  findByName(name: string): Promise<PermissionModel | null>;
  findAll(params?: IPermissionRepositoryFindAllParams): Promise<IPermissionRepositoryFindAllResult>;
  create(data: CreatePermissionInput): Promise<PermissionModel>;
  update(id: string, data: UpdatePermissionInput): Promise<PermissionModel>;
  delete(id: string): Promise<void>;
} 