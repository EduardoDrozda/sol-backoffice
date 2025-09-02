import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IBaseUseCase } from '../IBase.use-case';
import { UpdateGroupRequestDto } from '@application/dtos/group/request';
import { GetGroupResponseDto } from '@application/dtos/group/response';
import {
  GROUP_REPOSITORY,
  IGroupRepository,
} from '@domain/interfaces/repositories';
import { LoggerService } from '@common/logger';

@Injectable()
export class UpdateGroupUseCase
  implements IBaseUseCase<UpdateGroupRequestDto, GetGroupResponseDto>
{
  constructor(
    @Inject(GROUP_REPOSITORY)
    private readonly groupRepository: IGroupRepository,
    private readonly logger: LoggerService,
  ) {}

  async execute(data: UpdateGroupRequestDto): Promise<GetGroupResponseDto> {
    this.logger.log(`Updating group: ${data.id}`);
    const group = await this.getGroupOrThrow(data.id);
    return await this.updateGroup(data.id, data);
  }

  private async getGroupOrThrow(id: string) {
    const group = await this.groupRepository.findById(id);
    if (!group) {
      throw new NotFoundException('Group not found');
    }
    return group;
  }

  private async updateGroup(id: string, data: UpdateGroupRequestDto) {
    return this.groupRepository.update(id, data);
  }
}
