import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IBaseUseCase } from '../IBase.use-case';
import {
  PROJECT_REPOSITORY,
  IProjectRepository,
} from '@domain/interfaces/repositories';
import { LoggerService } from '@common/logger';

@Injectable()
export class DeleteProjectUseCase implements IBaseUseCase<string, void> {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: IProjectRepository,
    private readonly logger: LoggerService,
  ) {}

  async execute(id: string): Promise<void> {
    this.logger.log(`Deleting project: ${id}`);

    const project = await this.projectRepository.findById(id);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    await this.projectRepository.delete(id);
  }
} 