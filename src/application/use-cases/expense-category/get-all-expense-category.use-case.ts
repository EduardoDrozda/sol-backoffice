import { Inject, Injectable } from '@nestjs/common';
import { IBaseUseCase } from '../IBase.use-case';
import { GetPaginationBaseDto } from '@application/dtos/base/requests';
import {
  EXPENSE_CATEGORY_REPOSITORY,
  IExpenseCategoryRepository,
} from '@domain/interfaces/repositories';
import { LoggerService } from '@common/logger';
import { BaseResponseWithPaginationDto } from '@application/dtos/base/response';
import { GetExpenseCategoryResponseDto } from '@application/dtos/expense-category/response';

@Injectable()
export class GetAllExpenseCategoryUseCase
  implements
    IBaseUseCase<
      GetPaginationBaseDto,
      BaseResponseWithPaginationDto<GetExpenseCategoryResponseDto>
    >
{
  constructor(
    @Inject(EXPENSE_CATEGORY_REPOSITORY)
    private readonly expenseCategoryRepository: IExpenseCategoryRepository,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.context = this.constructor.name;
  }

  async execute(data: GetPaginationBaseDto) {
    const { page, limit, search, sort, order } = data;
    this.loggerService.log(`Fetching all expense categories`);

    const result = await this.expenseCategoryRepository.findAll({
      search,
      sort,
      order,
      page,
      limit,
    });

    this.loggerService.log(`Found ${result.total} expense categories total, showing ${result.data.length} in current page`);

    const totalPages = Math.ceil(result.total / limit);

    return {
      data: result.data,
      total: result.total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }
}
