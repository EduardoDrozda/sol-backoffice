import { Inject, Injectable } from '@nestjs/common';
import { IBaseUseCase } from '../IBase.use-case';
import {
  GROUP_REPOSITORY,
  IGroupRepository,
} from '@domain/interfaces/repositories';
import { BaseResponseWithPaginationDto } from '@application/dtos/base/response';
import { LoggerService } from '@common/logger';
import { PaginationHelper } from '@application/helpers/pagination.helper';
import { GetExpenseCategoryResponseDto } from '@application/dtos/expense-category/response';
import { GetPaginationBaseDto } from '@application/dtos/base/requests';
import { GetGroupResponseDto } from '@application/dtos/group/response';

@Injectable()
export class GetAllGroupUseCase
  implements
    IBaseUseCase<
      GetPaginationBaseDto,
      BaseResponseWithPaginationDto<GetGroupResponseDto>
    >
{
  constructor(
    @Inject(GROUP_REPOSITORY)
    private readonly groupRepository: IGroupRepository,
    private readonly loggerService: LoggerService,
  ) {}

  async execute(
    data: GetPaginationBaseDto,
  ): Promise<BaseResponseWithPaginationDto<GetGroupResponseDto>> {
    const { page, limit, search } = data;
    this.loggerService.log(`Fetching all groups`);

    const groups = await this.groupRepository.findAll(search);

    return PaginationHelper.paginate<GetGroupResponseDto>(groups, page, limit);
  }
}
