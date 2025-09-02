import { CreatePermissionRequestDTO } from '@application/dtos/permission/requests';
import { IPermissionRepository, PERMISSION_REPOSITORY } from '@domain/interfaces/repositories';
import { PermissionModel } from '@domain/models';
import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { IBaseUseCase } from '../IBase.use-case';
import { LoggerService } from '@common/logger';
import { GetPermissionDTO } from '@application/dtos/permission/responses/get-permission.dto';

@Injectable()
export class CreatePermissionUseCase implements IBaseUseCase<CreatePermissionRequestDTO, GetPermissionDTO> {
  constructor(
    @Inject(PERMISSION_REPOSITORY) private readonly permissionRepository: IPermissionRepository,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.context = this.constructor.name;
  }

  async execute(data: CreatePermissionRequestDTO): Promise<GetPermissionDTO> {
    this.loggerService.log(`Creating permission with data: ${JSON.stringify(data)}`);
    await this.ensurePermissionNameIsUnique(data.name);
    const newPermission = await this.createPermission(data);
    this.loggerService.log(`Permission created with id: ${newPermission.id}`);
    return this.mapToGetPermissionDTO(newPermission);
  }

  private async ensurePermissionNameIsUnique(name: string): Promise<void> {
    const existingPermission = await this.permissionRepository.findByName(name);
    if (existingPermission) {
      this.loggerService.warn(`Permission with name ${name} already exists.`);
      throw new ConflictException('Permission with this name already exists');
    }
  }

  private async createPermission(data: CreatePermissionRequestDTO): Promise<PermissionModel> {
    return this.permissionRepository.create({
      name: data.name,
      description: data.description,
    });
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