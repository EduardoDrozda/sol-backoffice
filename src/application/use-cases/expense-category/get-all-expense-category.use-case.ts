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
import { PaginationHelper } from '@application/helpers';

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
    const { page, limit, search } = data;
    this.loggerService.log(`Fetching all expense categories for companyId`);

    const categories = await this.expenseCategoryRepository.findAll(search);

    return PaginationHelper.paginate<GetExpenseCategoryResponseDto>(
      categories,
      page,
      limit,
    );
  }
}
