import { CreateExpenseCategoryUseCase } from './create-expense-category.use-case';
import { DeleteByIdExpenseCategoryUseCase } from './delete-by-id-expense-category.use-case';
import { GetAllExpenseCategoryUseCase } from './get-all-expense-category.use-case';
import { GetByIdExpenseCategoryUseCase } from './get-by-id-expense-category.use-case';
import { UpdateExpenseCategoryUseCase } from './update-expense-category.use-case';

export * from './create-expense-category.use-case';
export * from './get-all-expense-category.use-case';
export * from './get-by-id-expense-category.use-case';
export * from './update-expense-category.use-case';
export * from './delete-by-id-expense-category.use-case';

export const EXPENSE_CATEGORY_USE_CASES = [
  CreateExpenseCategoryUseCase,
  GetAllExpenseCategoryUseCase,
  GetByIdExpenseCategoryUseCase,
  UpdateExpenseCategoryUseCase,
  DeleteByIdExpenseCategoryUseCase,
];
