import { IPermissionRepository, PERMISSION_REPOSITORY } from '@domain/interfaces/repositories';
import { PermissionModel } from '@domain/models';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IBaseUseCase } from '../IBase.use-case';
import { LoggerService } from '@common/logger';
import { GetPermissionDTO } from '@application/dtos/permission/responses/get-permission.dto';

@Injectable()
export class GetPermissionByIdUseCase implements IBaseUseCase<string, GetPermissionDTO> {
  constructor(
    @Inject(PERMISSION_REPOSITORY) private readonly permissionRepository: IPermissionRepository,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.context = this.constructor.name;
  }

  async execute(id: string): Promise<GetPermissionDTO> {
    this.loggerService.log(`Getting permission by id: ${id}`);
    const permission = await this.permissionRepository.findById(id);
    
    if (!permission) {
      this.loggerService.warn(`Permission with id ${id} not found`);
      throw new NotFoundException('Permission not found');
    }

    this.loggerService.log(`Permission found: ${permission.name}`);
    return this.mapToGetPermissionDTO(permission);
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