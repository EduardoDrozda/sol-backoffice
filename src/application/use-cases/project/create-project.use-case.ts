import {
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { IBaseUseCase } from '../IBase.use-case';
import { CreateProjectRequestDto } from '@application/dtos/project/request';

import { LoggerService } from '@common/logger';
import { GetProjectResponseDto } from '@application/dtos/project/response';
import {
  PROJECT_REPOSITORY,
  IProjectRepository,
} from '@domain/interfaces/repositories';
import { ContextService } from '@common/context';

@Injectable()
export class CreateProjectUseCase
  implements IBaseUseCase<CreateProjectRequestDto, GetProjectResponseDto>
{
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: IProjectRepository,
    private readonly loggerService: LoggerService,
    private readonly contextService: ContextService,
  ) {}

  async execute(
    data: CreateProjectRequestDto,
  ): Promise<GetProjectResponseDto> {
    this.loggerService.log(
      `Creating project with data: ${JSON.stringify(data)}`,
    );

    const existingProject = await this.projectRepository.findByName(
      data.name,
    );

    if (existingProject) {
      this.loggerService.warn(
        `Project with name "${data.name}" already exists`,
      );
      throw new ConflictException(
        `Project with name "${data.name}" already exists.`,
      );
    }

    const user = this.contextService.getUser();

    return this.projectRepository.create({
      name: data.name,
      description: data.description,
      company: {
        connect: {
          id: user!.companyId,
        },
      },
    });
  }
} 