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

    const project = await this.projectRepository.findById(data.id);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const updatedProject = await this.projectRepository.update(
      data.id,
      data,
    );

    return {
      id: updatedProject.id,
      name: updatedProject.name,
      description: updatedProject.description,
      companyId: updatedProject.companyId,
      createdAt: updatedProject.createdAt,
      updatedAt: updatedProject.updatedAt,
    };
  }
} 