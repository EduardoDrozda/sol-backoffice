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
import { AuthenticationService } from '@common/authentication';

@Injectable()
export class CreateProjectUseCase
  implements IBaseUseCase<CreateProjectRequestDto, GetProjectResponseDto>
{
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: IProjectRepository,
    private readonly loggerService: LoggerService,
    private readonly authenticationService: AuthenticationService,
  ) {}

  async execute(
    data: CreateProjectRequestDto,
  ): Promise<GetProjectResponseDto> {
    this.loggerService.log(
      `Creating project with data: ${JSON.stringify(data)}`,
    );
    await this.ensureProjectNameIsUnique(data.name);
    const user = this.getLoggedUser();
    return this.createProject(data, user);
  }

  private async ensureProjectNameIsUnique(name: string): Promise<void> {
    const existingProject = await this.projectRepository.findByName(name);
    if (existingProject) {
      this.loggerService.warn(
        `Project with name "${name}" already exists`,
      );
      throw new ConflictException(
        `Project with name "${name}" already exists.`,
      );
    }
  }

  private getLoggedUser() {
    const session = this.authenticationService.getSession();
    return session?.user;
  }

  private async createProject(data: CreateProjectRequestDto, user: any) {
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