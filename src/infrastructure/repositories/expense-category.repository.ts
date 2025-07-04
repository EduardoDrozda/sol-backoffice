import { IExpenseCategoryRepository } from "@domain/interfaces/repositories";
import { CreateExpenseCategoryInput, ExpenseCategoryModel, UpdateExpenseCategoryInput } from "@domain/models/expense-category.model";
import { DatabaseService } from "@infrastructure/database";
import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";

@Injectable()
export class ExpenseCategoryRepository implements IExpenseCategoryRepository {
  constructor(private readonly databaseService: DatabaseService) { }

  findAll(filter?: string): Promise<ExpenseCategoryModel[]> {
    const params: Prisma.ExpenseCategoryFindManyArgs = {
      orderBy: {
        name: 'asc'
      }
    };

    if (filter) {
      params.where = {
        OR: [
          {
            name: {
              contains: filter,
              mode: "insensitive"
            }
          },
          {
            description: {
              contains: filter,
              mode: "insensitive"
            }
          }
        ]
      }
    }

    return this.databaseService.expenseCategory.findMany(params);
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
    await this.update({
      id,
      deletedAt: new Date(),
    });
  }

  async create(data: CreateExpenseCategoryInput): Promise<ExpenseCategoryModel> {
    return this.databaseService.expenseCategory.create({
      data
    });
  }
}