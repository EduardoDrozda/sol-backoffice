import { CreateCostCenterUseCase } from './create-cost-center.use-case';
import { GetAllCostCenterUseCase } from './get-all-cost-center.use-case';
import { GetCostCenterByIdUseCase } from './get-cost-center-by-id.use-case';
import { UpdateCostCenterUseCase } from './update-cost-center.use-case';
import { DeleteCostCenterUseCase } from './delete-cost-center.use-case';

export * from './create-cost-center.use-case';
export * from './get-all-cost-center.use-case';
export * from './get-cost-center-by-id.use-case';
export * from './update-cost-center.use-case';
export * from './delete-cost-center.use-case';

export const COST_CENTER_USE_CASES = [
  CreateCostCenterUseCase,
  GetAllCostCenterUseCase,
  GetCostCenterByIdUseCase,
  UpdateCostCenterUseCase,
  DeleteCostCenterUseCase,
];
