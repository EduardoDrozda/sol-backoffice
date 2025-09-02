import { Inject, Injectable } from "@nestjs/common";
import { IBaseUseCase } from "../IBase.use-case";
import { GetExpenseRequestDto } from "@application/dtos/expense/request";
import { BaseResponseWithPaginationDto } from "@application/dtos/base/response";
import { ExpenseModel } from "@domain/models";
import { EXPENSE_REPOSITORY, IExpenseRepository } from "@domain/interfaces/repositories";
import { LoggerService } from "@common/logger";

@Injectable()
export class GetAllExpenseUseCase implements IBaseUseCase<GetExpenseRequestDto, BaseResponseWithPaginationDto<ExpenseModel>> {
  constructor(
    @Inject(EXPENSE_REPOSITORY) private readonly expenseRepository: IExpenseRepository,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.context = this.constructor.name;
  }

  async execute(data: GetExpenseRequestDto) {
    this.loggerService.log(`Fetching all expenses`);

    const result = await this.expenseRepository.findAll({
      ...data,
      sort: data.sort as 'createdAt' | 'updatedAt' | 'amount',
      order: data.order as 'asc' | 'desc',
      page: data.page,
      limit: data.limit,
    });

    this.loggerService.log(`Found ${result.total} expenses total, showing ${result.data.length} in current page`);

    const totalPages = Math.ceil(result.total / (data.limit || 10));

    return {
      data: result.data,
      total: result.total,
      page: data.page || 1,
      limit: data.limit || 10,
      totalPages,
      hasNextPage: (data.page || 1) < totalPages,
      hasPreviousPage: (data.page || 1) > 1,
    };
  }
} 