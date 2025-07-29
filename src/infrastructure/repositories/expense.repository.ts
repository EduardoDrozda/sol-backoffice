import { ExpenseFilterParams, IExpenseRepository, IExpenseRepositoryFindAllResult } from "@domain/interfaces/repositories";
import { ExpenseCreateInput, ExpenseModel, ExpenseUpdateInput } from "@domain/models";
import { DatabaseService } from "@infrastructure/database";
import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";

@Injectable()
export class ExpenseRepository implements IExpenseRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  create(data: ExpenseCreateInput): Promise<ExpenseModel> {
    return this.databaseService.expense.create({
      data,
    });
  }
  async findAll(params: ExpenseFilterParams): Promise<IExpenseRepositoryFindAllResult> {
    const { search, isPaid, categoryId, costCenterId, groupId, projectId, issueDate, page, limit } = params;

    const where: Prisma.ExpenseWhereInput = {
      userId: params.userId ?? undefined,
      isPaid: isPaid ?? undefined,
      categoryExpenseId: categoryId ?? undefined,
      costCenterId: costCenterId ?? undefined,
      groupId: groupId ?? undefined,
      projectId: projectId ?? undefined,
      issueDate: issueDate ?? undefined,
      description: search ? {
        contains: search,
        mode: 'insensitive',
      } : undefined,
    };

    const orderBy: Prisma.ExpenseOrderByWithRelationInput = {
      createdAt: params.sort === 'createdAt' ? params.order === 'asc' ? 'asc' : 'desc' : undefined,
      updatedAt: params.sort === 'updatedAt' ? params.order === 'asc' ? 'asc' : 'desc' : undefined,
      amount: params.sort === 'amount' ? params.order === 'asc' ? 'asc' : 'desc' : undefined,
    };

    const currentPage = page || 1;
    const currentLimit = limit || 10;
    const skip = (currentPage - 1) * currentLimit;

    const total = await this.databaseService.expense.count({
      where,
    });

    const data = await this.databaseService.expense.findMany({
      where,
      orderBy,
      skip,
      take: currentLimit,
    });

    return {
      data,
      total,
    };
  }
  findById(id: string): Promise<ExpenseModel | null> {
    return this.databaseService.expense.findUnique({
      where: {
        id,
      },
    });
  }
  update(data: ExpenseUpdateInput): Promise<ExpenseModel> {
    return this.databaseService.expense.update({
      where: {
       id: data.id as string,
      },
      data,
    });
  }
  
  async delete(id: string): Promise<void> {
    await this.databaseService.expense.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}