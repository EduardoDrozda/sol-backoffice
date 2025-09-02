import {
  CostCenterModel,
  CreateCostCenterInput,
  UpdateCostCenterInput,
} from '@domain/models';

export const COST_CENTER_REPOSITORY = Symbol('ICostCenterRepository');

export interface ICostCenterRepositoryFindAllParams {
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface ICostCenterRepositoryFindAllResult {
  data: CostCenterModel[];
  total: number;
}

export interface ICostCenterRepository {
  create(data: CreateCostCenterInput): Promise<CostCenterModel>;
  findAll(params?: ICostCenterRepositoryFindAllParams): Promise<ICostCenterRepositoryFindAllResult>;
  findById(id: string): Promise<CostCenterModel | null>;
  findByName(name: string): Promise<CostCenterModel | null>;
  update(id: string, data: UpdateCostCenterInput): Promise<CostCenterModel>;
  delete(id: string): Promise<void>;
}
