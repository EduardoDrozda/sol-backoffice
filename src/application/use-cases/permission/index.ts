import { CreatePermissionUseCase } from './create-permission.use-case';
import { GetAllPermissionsUseCase } from './get-all-permissions.use-case';
import { GetPermissionByIdUseCase } from './get-permission-by-id.use-case';
import { UpdatePermissionUseCase } from './update-permission.use-case';
import { DeletePermissionUseCase } from './delete-permission.use-case';

export * from './create-permission.use-case';
export * from './get-all-permissions.use-case';
export * from './get-permission-by-id.use-case';
export * from './update-permission.use-case';
export * from './delete-permission.use-case';

export const PERMISSION_USE_CASES = [
  CreatePermissionUseCase,
  GetAllPermissionsUseCase,
  GetPermissionByIdUseCase,
  UpdatePermissionUseCase,
  DeletePermissionUseCase,
]; 