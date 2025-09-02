import {
  CreateExpenseCategoryInput,
  ExpenseCategoryModel,
  UpdateExpenseCategoryInput,
} from '@domain/models/expense-category.model';

export const EXPENSE_CATEGORY_REPOSITORY = Symbol('IExpenseCategoryRepository');

export interface IExpenseCategoryRepositoryFindAllParams {
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface IExpenseCategoryRepositoryFindAllResult {
  data: ExpenseCategoryModel[];
  total: number;
}

export interface IExpenseCategoryRepository {
  create(data: CreateExpenseCategoryInput): Promise<ExpenseCategoryModel>;
  findAll(params?: IExpenseCategoryRepositoryFindAllParams): Promise<IExpenseCategoryRepositoryFindAllResult>;
  findById(id: string): Promise<ExpenseCategoryModel | null>;
  findByName(name: string): Promise<ExpenseCategoryModel | null>;
  update(data: UpdateExpenseCategoryInput): Promise<ExpenseCategoryModel>;
  delete(id: string): Promise<void>;
}
