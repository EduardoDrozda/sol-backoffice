import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IBaseUseCase } from '../IBase.use-case';

import { LoggerService } from '@common/logger';
import {
  GROUP_REPOSITORY,
  IGroupRepository,
} from '@domain/interfaces/repositories';

@Injectable()
export class DeleteGroupUseCase implements IBaseUseCase<string, void> {
  constructor(
    @Inject(GROUP_REPOSITORY)
    private readonly groupRepository: IGroupRepository,
    private readonly logger: LoggerService,
  ) {}

  async execute(id: string): Promise<void> {
    this.logger.log(`Deleting group: ${id}`);
    const group = await this.getGroupOrThrow(id);
    await this.deleteGroup(id);
  }

  private async getGroupOrThrow(id: string) {
    const group = await this.groupRepository.findById(id);
    if (!group) {
      throw new NotFoundException('Group not found');
    }
    return group;
  }

  private async deleteGroup(id: string): Promise<void> {
    await this.groupRepository.delete(id);
  }
}
