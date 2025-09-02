import { CreateExpenseUseCase } from './create-expense.use-case';
import { GetAllExpenseUseCase } from './get-all-expense.use-case';

export * from './create-expense.use-case';
export * from './get-all-expense.use-case';

export const EXPENSES_USE_CASES = [
  CreateExpenseUseCase,
  GetAllExpenseUseCase
]