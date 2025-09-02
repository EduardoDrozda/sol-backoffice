import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IBaseUseCase } from '../IBase.use-case';
import { GetProjectResponseDto } from '@application/dtos/project/response';
import {
  PROJECT_REPOSITORY,
  IProjectRepository,
} from '@domain/interfaces/repositories';
import { LoggerService } from '@common/logger';

@Injectable()
export class GetProjectByIdUseCase
  implements IBaseUseCase<string, GetProjectResponseDto>
{
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: IProjectRepository,
    private readonly logger: LoggerService,
  ) {}

  async execute(id: string): Promise<GetProjectResponseDto> {
    this.logger.log(`Get project by id: ${id}`);
    const project = await this.getProjectOrThrow(id);
    return this.mapToGetProjectResponseDto(project);
  }

  private async getProjectOrThrow(id: string) {
    const project = await this.projectRepository.findById(id);
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  private mapToGetProjectResponseDto(project: any): GetProjectResponseDto {
    return {
      id: project.id,
      name: project.name,
      description: project.description,
      companyId: project.companyId,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };
  }
} 