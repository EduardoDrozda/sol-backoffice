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

    const existingGroup = await this.groupRepository.findByName(data.name);

    if (existingGroup) {
      this.loggerService.warn(`Group with name "${data.name}" already exists`);
      throw new ConflictException(
        `Group with name "${data.name}" already exists.`,
      );
    }

    const session = this.authenticationService.getSession();
    const user = session?.user;

    return await this.groupRepository.create({
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
