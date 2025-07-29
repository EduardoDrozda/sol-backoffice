import { IExpenseCategoryRepository, IExpenseCategoryRepositoryFindAllParams, IExpenseCategoryRepositoryFindAllResult } from '@domain/interfaces/repositories';
import {
  CreateExpenseCategoryInput,
  ExpenseCategoryModel,
  UpdateExpenseCategoryInput,
} from '@domain/models/expense-category.model';
import { DatabaseService } from '@infrastructure/database';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class ExpenseCategoryRepository implements IExpenseCategoryRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(params?: IExpenseCategoryRepositoryFindAllParams): Promise<IExpenseCategoryRepositoryFindAllResult> {
    let whereClause: Prisma.ExpenseCategoryWhereInput = {
      deletedAt: null,
    };
    let orderBy: Prisma.ExpenseCategoryOrderByWithRelationInput = {
      name: 'asc',
    };

    if (params?.search) {
      whereClause = {
        ...whereClause,
        OR: [
          {
            name: {
              contains: params.search,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: params.search,
              mode: 'insensitive',
            },
          },
        ],
      };
    }

    if (params?.sort && params?.order) {
      orderBy = {
        [params.sort]: params.order,
      };
    }

    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const skip = (page - 1) * limit;

    const total = await this.databaseService.expenseCategory.count({
      where: whereClause,
    });

    const data = await this.databaseService.expenseCategory.findMany({
      where: whereClause,
      orderBy,
      skip,
      take: limit,
    });

    return {
      data,
      total,
    };
  }

  findById(id: string): Promise<ExpenseCategoryModel | null> {
    return this.databaseService.expenseCategory.findUnique({
      where: {
        id,
      },
    });
  }

  findByName(name: string): Promise<ExpenseCategoryModel | null> {
    return this.databaseService.expenseCategory.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive',
        },
      },
    });
  }

  update(data: UpdateExpenseCategoryInput): Promise<ExpenseCategoryModel> {
    return this.databaseService.expenseCategory.update({
      where: {
        id: data.id as string,
      },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.update({
      id,
      deletedAt: new Date(),
    });
  }

  async create(
    data: CreateExpenseCategoryInput,
  ): Promise<ExpenseCategoryModel> {
    return this.databaseService.expenseCategory.create({
      data,
    });
  }
}
