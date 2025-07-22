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
import { PaginationHelper } from '@application/helpers';

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
    const { page, limit, search } = data;
    this.loggerService.log(`Fetching all projects`);
    const projects = await this.getAllProjects(search);
    return this.paginateProjects(projects, page, limit);
  }

  private async getAllProjects(search?: string) {
    return this.projectRepository.findAll(search);
  }

  private paginateProjects(projects: any[], page: number, limit: number) {
    return PaginationHelper.paginate<GetProjectResponseDto>(
      projects,
      page,
      limit,
    );
  }
} 