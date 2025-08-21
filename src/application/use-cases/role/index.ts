import { CreateRoleUseCase } from './create-role.use-case';
import { GetAllRolesUseCase } from './get-all-roles.use-case';
import { GetRoleByIdUseCase } from './get-role-by-id.use-case';
import { UpdateRoleUseCase } from './update-role.use-case';
import { DeleteRoleUseCase } from './delete-role.use-case';
import { GetAllRolesSimpleUseCase } from './get-all-roles-simple.use-case';

export * from './create-role.use-case';
export * from './get-all-roles.use-case';
export * from './get-role-by-id.use-case';
export * from './update-role.use-case';
export * from './delete-role.use-case';
export * from './get-all-roles-simple.use-case';

export const ROLE_USE_CASES = [
  CreateRoleUseCase,
  GetAllRolesUseCase,
  GetRoleByIdUseCase,
  UpdateRoleUseCase,
  DeleteRoleUseCase,
  GetAllRolesSimpleUseCase,
]; 