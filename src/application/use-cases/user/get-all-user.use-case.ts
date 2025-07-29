import { Inject, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { IBaseUseCase } from '../IBase.use-case';
import { USER_REPOSITORY } from '@domain/interfaces/repositories';
import { IUserRepository } from '@domain/interfaces/repositories';
import { LoggerService } from '@common/logger';
import { GetPaginationBaseDto } from '@application/dtos/base/requests';
import { GetUserResponseDto } from '@application/dtos/user/responses/get-user.response.dto';
import { BaseResponseWithPaginationDto } from '@application/dtos/base/response';
import { PaginationHelper } from '@application/helpers';

@Injectable()
export class GetAllUserUseCase implements
  IBaseUseCase<
    GetPaginationBaseDto,
    BaseResponseWithPaginationDto<GetUserResponseDto>
  > {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.context = this.constructor.name;
  }

  async execute(data: GetPaginationBaseDto): Promise<BaseResponseWithPaginationDto<GetUserResponseDto>> {
    const { page, limit, search, sort, order } = data;

    this.loggerService.log('Executing...');

    const users = await this.userRepository.findAll({
      includeRole: true,
      search,
      sort,
      order,
    });

    this.loggerService.log(`Found ${users.length} users`);

    const mappedUsers: GetUserResponseDto[] = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: {
        id: user.role?.id,
        name: user.role?.name,
      },
      company_id: user.companyId,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
      is_active: user.isActive,
    }));

    return PaginationHelper.paginate<GetUserResponseDto>(
      mappedUsers,
      page,
      limit,
    );
  }
}