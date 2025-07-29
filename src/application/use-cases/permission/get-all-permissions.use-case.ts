import { IPermissionRepository, PERMISSION_REPOSITORY } from '@domain/interfaces/repositories';
import { PermissionModel } from '@domain/models';
import { Inject, Injectable } from '@nestjs/common';
import { IBaseUseCase } from '../IBase.use-case';
import { LoggerService } from '@common/logger';
import { GetPermissionDTO } from '@application/dtos/permission/responses/get-permission.dto';
import { GetPaginationBaseDto } from '@application/dtos/base/requests';
import { BaseResponseWithPaginationDto } from '@application/dtos/base/response';

@Injectable()
export class GetAllPermissionsUseCase implements IBaseUseCase<GetPaginationBaseDto, BaseResponseWithPaginationDto<GetPermissionDTO>> {
  constructor(
    @Inject(PERMISSION_REPOSITORY) private readonly permissionRepository: IPermissionRepository,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.context = this.constructor.name;
  }

  async execute(data: GetPaginationBaseDto): Promise<BaseResponseWithPaginationDto<GetPermissionDTO>> {
    const { page, limit, search, sort, order } = data;

    this.loggerService.log('Getting all permissions');
    const result = await this.permissionRepository.findAll({
      search,
      sort,
      order,
      page,
      limit,
    });
    
    this.loggerService.log(`Found ${result.total} permissions total, showing ${result.data.length} in current page`);

    const mappedPermissions: GetPermissionDTO[] = result.data.map(permission => this.mapToGetPermissionDTO(permission));

    const totalPages = Math.ceil(result.total / limit);

    return {
      data: mappedPermissions,
      total: result.total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }

  private mapToGetPermissionDTO(permission: PermissionModel): GetPermissionDTO {
    return {
      id: permission.id,
      name: permission.name,
      description: permission.description,
      companyId: permission.companyId || '',
      createdAt: permission.createdAt,
      createdById: permission.createdById || '',
      updatedAt: permission.updatedAt,
      updatedById: permission.updatedById || '',
      deletedAt: permission.deletedAt || new Date(),
      deletedById: permission.deletedById || '',
    };
  }
} 