import { CostCenterModel, CreateCostCenterInput, UpdateCostCenterInput } from "@domain/models";

export const COST_CENTER_REPOSITORY = Symbol('ICostCenterRepository');

export interface ICostCenterRepository {
  create(data: CreateCostCenterInput): Promise<CostCenterModel>;
  findAll(filter?: string): Promise<CostCenterModel[]>;
  findById(id: string): Promise<CostCenterModel | null>;
  findByName(name: string): Promise<CostCenterModel | null>;
  update(id: string, data: UpdateCostCenterInput): Promise<CostCenterModel>;
  delete(id: string): Promise<void>;
}