import { IExpenseCategoryRepository } from "@domain/interfaces/repositories";
import { CreateExpenseCategoryInput, ExpenseCategoryModel, UpdateExpenseCategoryInput } from "@domain/models/expense-category.model";
import { DatabaseService } from "@infrastructure/database";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ExpenseCategoryRepository implements IExpenseCategoryRepository {
  constructor(private readonly databaseService: DatabaseService) { }

  findAll(): Promise<ExpenseCategoryModel[]> {
    return this.databaseService.expenseCategory.findMany();
  }

  findById(id: string): Promise<ExpenseCategoryModel | null> {
    return this.databaseService.expenseCategory.findUnique({
      where: {
        id
      }
    });
  }

  findByName(name: string): Promise<ExpenseCategoryModel | null> {
    return this.databaseService.expenseCategory.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive"
        }
      }
    });
  }
  
  update(data: UpdateExpenseCategoryInput): Promise<ExpenseCategoryModel> {
    return this.databaseService.expenseCategory.update({
      where: {
        id: data.id as string
      },
      data
    });
  }

  async delete(id: string): Promise<void> {
    this.databaseService.expenseCategory.delete({
      where: {
        id
      }
    });
  }

  async create(data: CreateExpenseCategoryInput): Promise<ExpenseCategoryModel> {
    return this.databaseService.expenseCategory.create({
      data
    });
  }
}