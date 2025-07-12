import { CreateProjectUseCase } from './create-project.use-case';
import { GetAllProjectUseCase } from './get-all-project.use-case';
import { GetProjectByIdUseCase } from './get-project-by-id.use-case';
import { UpdateProjectUseCase } from './update-project.use-case';
import { DeleteProjectUseCase } from './delete-project.use-case';

export * from './create-project.use-case';
export * from './get-all-project.use-case';
export * from './get-project-by-id.use-case';
export * from './update-project.use-case';
export * from './delete-project.use-case';

export const PROJECT_USE_CASES = [
  CreateProjectUseCase,
  GetAllProjectUseCase,
  GetProjectByIdUseCase,
  UpdateProjectUseCase,
  DeleteProjectUseCase,
]; 