import { Expense, Prisma } from "@prisma/client";

export type ExpenseModel = Expense;

export type ExpenseCreateInput = Prisma.ExpenseCreateInput;

export type ExpenseUpdateInput = Prisma.ExpenseUpdateInput;