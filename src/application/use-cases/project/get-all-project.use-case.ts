import { Inject, Injectable } from '@nestjs/common';
import { IBaseUseCase } from '../IBase.use-case';
import { GetPaginationBaseDto } from '@application/dtos/base/requests';
import {
  PROJECT_REPOSITORY,
  IProjectRepository,
} from '@domain/interfaces/repositories';
import { BaseResponseWithPaginationDto } from '@application/dtos/base/response';
import { GetProjectResponseDto } from '@application/dtos/project/response';
import { LoggerService } from '@common/logger';

@Injectable()
export class GetAllProjectUseCase
  implements
    IBaseUseCase<
      GetPaginationBaseDto,
      BaseResponseWithPaginationDto<GetProjectResponseDto>
    >
{
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: IProjectRepository,
    private readonly loggerService: LoggerService,
  ) {}

  async execute(
    data: GetPaginationBaseDto,
  ): Promise<BaseResponseWithPaginationDto<GetProjectResponseDto>> {
    const { page, limit, search, sort, order } = data;
    this.loggerService.log(`Fetching all projects`);
    
    const result = await this.projectRepository.findAll({
      search,
      sort,
      order,
      page,
      limit,
    });

    this.loggerService.log(`Found ${result.total} projects total, showing ${result.data.length} in current page`);

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