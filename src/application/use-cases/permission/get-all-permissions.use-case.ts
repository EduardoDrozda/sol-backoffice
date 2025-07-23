import { IPermissionRepository, PERMISSION_REPOSITORY } from '@domain/interfaces/repositories';
import { PermissionModel } from '@domain/models';
import { Inject, Injectable } from '@nestjs/common';
import { IBaseUseCase } from '../IBase.use-case';
import { LoggerService } from '@common/logger';
import { GetPermissionDTO } from '@application/dtos/permission/responses/get-permission.dto';

@Injectable()
export class GetAllPermissionsUseCase implements IBaseUseCase<void, GetPermissionDTO[]> {
  constructor(
    @Inject(PERMISSION_REPOSITORY) private readonly permissionRepository: IPermissionRepository,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.context = this.constructor.name;
  }

  async execute(): Promise<GetPermissionDTO[]> {
    this.loggerService.log('Getting all permissions');
    const permissions = await this.permissionRepository.findAll();
    this.loggerService.log(`Found ${permissions.length} permissions`);
    return permissions.map(permission => this.mapToGetPermissionDTO(permission));
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