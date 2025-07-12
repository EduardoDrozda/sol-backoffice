import {
  CreateExpenseCategoryInput,
  ExpenseCategoryModel,
  UpdateExpenseCategoryInput,
} from '@domain/models/expense-category.model';

export const EXPENSE_CATEGORY_REPOSITORY = Symbol('IExpenseCategoryRepository');

export interface IExpenseCategoryRepository {
  create(data: CreateExpenseCategoryInput): Promise<ExpenseCategoryModel>;
  findAll(filter?: string): Promise<ExpenseCategoryModel[]>;
  findById(id: string): Promise<ExpenseCategoryModel | null>;
  findByName(name: string): Promise<ExpenseCategoryModel | null>;
  update(data: UpdateExpenseCategoryInput): Promise<ExpenseCategoryModel>;
  delete(id: string): Promise<void>;
}
