import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { IBaseUseCase } from '../IBase.use-case';
import {
  GROUP_REPOSITORY,
  IGroupRepository,
} from '@domain/interfaces/repositories';
import { LoggerService } from '@common/logger';
import { CreateGroupRequestDto } from '@application/dtos/group/request';
import { GetGroupResponseDto } from '@application/dtos/group/response';
import { AuthenticationService } from '@common/authentication';

@Injectable()
export class CreateGroupUseCase
  implements IBaseUseCase<CreateGroupRequestDto, GetGroupResponseDto>
{
  constructor(
    @Inject(GROUP_REPOSITORY)
    private readonly groupRepository: IGroupRepository,
    private readonly loggerService: LoggerService,
    private readonly authenticationService: AuthenticationService,
  ) {}

  async execute(data: CreateGroupRequestDto): Promise<GetGroupResponseDto> {
    this.loggerService.log(`Creating group with data: ${JSON.stringify(data)}`);
    await this.ensureGroupNameIsUnique(data.name);
    const user = this.getLoggedUser();
    return await this.createGroup(data, user);
  }

  private async ensureGroupNameIsUnique(name: string): Promise<void> {
    const existingGroup = await this.groupRepository.findByName(name);
    if (existingGroup) {
      this.loggerService.warn(`Group with name "${name}" already exists`);
      throw new ConflictException(`Group with name "${name}" already exists.`);
    }
  }

  private getLoggedUser() {
    const session = this.authenticationService.getSession();
    return session?.user;
  }

  private async createGroup(data: CreateGroupRequestDto, user: any) {
    return this.groupRepository.create({
      name: data.name,
      description: data.description ?? null,
      company: {
        connect: {
          id: user!.companyId,
        },
      },
    });
  }
}
