import { ExpenseCreateInput, ExpenseModel, ExpenseUpdateInput } from "@domain/models";

export const EXPENSE_REPOSITORY = Symbol('EXPENSE_REPOSITORY');

export type ExpenseFilterParams = {
  search?: string;
  sort?: 'createdAt' | 'updatedAt' | 'amount';
  order?: 'asc' | 'desc';
  isPaid?: boolean;
  categoryId?: string;
  costCenterId?: string;
  groupId?: string;
  projectId?: string;
  issueDate?: string;
  userId?: string;
  page?: number;
  limit?: number;
}

export interface IExpenseRepositoryFindAllResult {
  data: ExpenseModel[];
  total: number;
}

export interface IExpenseRepository {
  create(data: ExpenseCreateInput): Promise<ExpenseModel>;
  findAll(params: ExpenseFilterParams): Promise<IExpenseRepositoryFindAllResult>;
  findById(id: string): Promise<ExpenseModel | null>;
  update(data: ExpenseUpdateInput): Promise<ExpenseModel>;
  delete(id: string): Promise<void>;
}