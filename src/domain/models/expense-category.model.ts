import { ExpenseCategory, Prisma } from '@prisma/client';

export type ExpenseCategoryModel = ExpenseCategory;

export type CreateExpenseCategoryInput = Prisma.ExpenseCategoryCreateInput;

export type UpdateExpenseCategoryInput = Prisma.ExpenseCategoryUpdateInput;
