import {
  GROUP_REPOSITORY,
  IGroupRepository,
} from '@domain/interfaces/repositories';
import { LoggerService } from '@common/logger';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IBaseUseCase } from '../IBase.use-case';
import { GetGroupResponseDto } from '@application/dtos/group/response';

@Injectable()
export class GetGroupByIdUseCase
  implements IBaseUseCase<string, GetGroupResponseDto>
{
  constructor(
    @Inject(GROUP_REPOSITORY)
    private readonly groupRepository: IGroupRepository,
    private readonly logger: LoggerService,
  ) {}

  async execute(id: string): Promise<GetGroupResponseDto> {
    this.logger.log(`Get group by id: ${id}`);
    const group = await this.getGroupOrThrow(id);
    return this.mapToGetGroupResponseDto(group);
  }

  private async getGroupOrThrow(id: string) {
    const group = await this.groupRepository.findById(id);
    if (!group) {
      throw new NotFoundException('Group not found');
    }
    return group;
  }

  private mapToGetGroupResponseDto(group: any): GetGroupResponseDto {
    return {
      id: group.id,
      name: group.name,
      description: group.description,
      companyId: group.companyId,
      createdAt: group.createdAt,
      updatedAt: group.updatedAt,
    };
  }
}
