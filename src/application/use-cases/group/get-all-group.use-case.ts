import { Inject, Injectable } from '@nestjs/common';
import { IBaseUseCase } from '../IBase.use-case';
import {
  GROUP_REPOSITORY,
  IGroupRepository,
} from '@domain/interfaces/repositories';
import { BaseResponseWithPaginationDto } from '@application/dtos/base/response';
import { LoggerService } from '@common/logger';
import { GetExpenseCategoryResponseDto } from '@application/dtos/expense-category/response';
import { GetPaginationBaseDto } from '@application/dtos/base/requests';
import { GetGroupResponseDto } from '@application/dtos/group/response';

@Injectable()
export class GetAllGroupUseCase
  implements
    IBaseUseCase<
      GetPaginationBaseDto,
      BaseResponseWithPaginationDto<GetGroupResponseDto>
    >
{
  constructor(
    @Inject(GROUP_REPOSITORY)
    private readonly groupRepository: IGroupRepository,
    private readonly loggerService: LoggerService,
  ) {}

  async execute(
    data: GetPaginationBaseDto,
  ): Promise<BaseResponseWithPaginationDto<GetGroupResponseDto>> {
    const { page, limit, search, sort, order } = data;
    this.loggerService.log(`Fetching all groups`);
    
    const result = await this.groupRepository.findAll({
      search,
      sort,
      order,
      page,
      limit,
    });

    this.loggerService.log(`Found ${result.total} groups total, showing ${result.data.length} in current page`);

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
