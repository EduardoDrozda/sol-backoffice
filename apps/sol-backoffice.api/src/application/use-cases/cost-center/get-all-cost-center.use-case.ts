import { Inject, Injectable } from '@nestjs/common';
import { IBaseUseCase } from '../IBase.use-case';
import { GetPaginationBaseDto } from '@application/dtos/base/requests';
import {
  COST_CENTER_REPOSITORY,
  ICostCenterRepository,
} from '@domain/interfaces/repositories';
import { BaseResponseWithPaginationDto } from '@application/dtos/base/response';
import { GetCostCenterResponseDto } from '@application/dtos/cost-center/response';
import { LoggerService } from '@common/logger';

@Injectable()
export class GetAllCostCenterUseCase
  implements
    IBaseUseCase<
      GetPaginationBaseDto,
      BaseResponseWithPaginationDto<GetCostCenterResponseDto>
    >
{
  constructor(
    @Inject(COST_CENTER_REPOSITORY)
    private readonly costCenterRepository: ICostCenterRepository,
    private readonly loggerService: LoggerService,
  ) {}

  async execute(
    data: GetPaginationBaseDto,
  ): Promise<BaseResponseWithPaginationDto<GetCostCenterResponseDto>> {
    const { page, limit, search, sort, order } = data;
    this.loggerService.log(`Fetching all cost centers`);
    
    const result = await this.costCenterRepository.findAll({
      search,
      sort,
      order,
      page,
      limit,
    });

    this.loggerService.log(`Found ${result.total} cost centers total, showing ${result.data.length} in current page`);

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
