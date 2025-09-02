import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IBaseUseCase } from '../IBase.use-case';
import { UpdateProjectRequestDto } from '@application/dtos/project/request';
import { GetProjectResponseDto } from '@application/dtos/project/response';
import {
  PROJECT_REPOSITORY,
  IProjectRepository,
} from '@domain/interfaces/repositories';
import { LoggerService } from '@common/logger';

@Injectable()
export class UpdateProjectUseCase
  implements IBaseUseCase<UpdateProjectRequestDto, GetProjectResponseDto>
{
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: IProjectRepository,
    private readonly logger: LoggerService,
  ) {}

  async execute(
    data: UpdateProjectRequestDto,
  ): Promise<GetProjectResponseDto> {
    this.logger.log(`Updating project: ${data.id}`);
    const project = await this.getProjectOrThrow(data.id);
    const updatedProject = await this.updateProject(data.id, data);
    return this.mapToGetProjectResponseDto(updatedProject);
  }

  private async getProjectOrThrow(id: string) {
    const project = await this.projectRepository.findById(id);
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  private async updateProject(id: string, data: UpdateProjectRequestDto) {
    return this.projectRepository.update(id, data);
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