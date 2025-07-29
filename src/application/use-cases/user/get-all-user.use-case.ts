import { Inject, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { IBaseUseCase } from '../IBase.use-case';
import { USER_REPOSITORY } from '@domain/interfaces/repositories';
import { IUserRepository } from '@domain/interfaces/repositories';
import { LoggerService } from '@common/logger';
import { GetPaginationBaseDto } from '@application/dtos/base/requests';
import { GetUserResponseDto } from '@application/dtos/user/responses/get-user.response.dto';
import { BaseResponseWithPaginationDto } from '@application/dtos/base/response';

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

    const result = await this.userRepository.findAll({
      includeRole: true,
      search,
      sort,
      order,
      page,
      limit,
    });

    this.loggerService.log(`Found ${result.total} users total, showing ${result.data.length} in current page`);

    const mappedUsers: GetUserResponseDto[] = result.data.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: {
        id: user.role?.id,
        name: user.role?.name,
      },
      companyId: user.companyId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      isActive: user.isActive,
    }));

    const totalPages = Math.ceil(result.total / limit);

    return {
      data: mappedUsers,
      total: result.total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }
}