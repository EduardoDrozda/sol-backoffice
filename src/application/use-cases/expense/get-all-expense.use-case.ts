import { Inject, Injectable } from "@nestjs/common";
import { IBaseUseCase } from "../IBase.use-case";
import { GetExpenseRequestDto } from "@application/dtos/expense/request";
import { BaseResponseWithPaginationDto } from "@application/dtos/base/response";
import { ExpenseModel } from "@domain/models";
import { EXPENSE_REPOSITORY, IExpenseRepository } from "@domain/interfaces/repositories";
import { LoggerService } from "@common/logger";
import { PaginationHelper } from "@application/helpers/pagination.helper";


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

    const expenses = await this.expenseRepository.findAll({
      ...data,
      sort: data.sort as 'createdAt' | 'updatedAt' | 'amount',
      order: data.order as 'asc' | 'desc'
    });

    return PaginationHelper.paginate<ExpenseModel>(expenses, data.page!, data.limit!);
  }
} 