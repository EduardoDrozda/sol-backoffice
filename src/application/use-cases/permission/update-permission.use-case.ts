import { UpdatePermissionRequestDTO } from '@application/dtos/permission/requests';
import { IPermissionRepository, PERMISSION_REPOSITORY } from '@domain/interfaces/repositories';
import { PermissionModel } from '@domain/models';
import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IBaseUseCase } from '../IBase.use-case';
import { LoggerService } from '@common/logger';
import { GetPermissionDTO } from '@application/dtos/permission/responses/get-permission.dto';

interface UpdatePermissionInput {
  id: string;
  data: UpdatePermissionRequestDTO;
}

@Injectable()
export class UpdatePermissionUseCase implements IBaseUseCase<UpdatePermissionInput, GetPermissionDTO> {
  constructor(
    @Inject(PERMISSION_REPOSITORY) private readonly permissionRepository: IPermissionRepository,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.context = this.constructor.name;
  }

  async execute({ id, data }: UpdatePermissionInput): Promise<GetPermissionDTO> {
    this.loggerService.log(`Updating permission with id: ${id} and data: ${JSON.stringify(data)}`);
    
    await this.ensurePermissionExists(id);
    
    if (data.name) {
      await this.ensurePermissionNameIsUnique(data.name, id);
    }

    const updatedPermission = await this.updatePermission(id, data);
    this.loggerService.log(`Permission updated successfully: ${updatedPermission.name}`);
    
    return this.mapToGetPermissionDTO(updatedPermission);
  }

  private async ensurePermissionExists(id: string): Promise<void> {
    const existingPermission = await this.permissionRepository.findById(id);
    if (!existingPermission) {
      this.loggerService.warn(`Permission with id ${id} not found`);
      throw new NotFoundException('Permission not found');
    }
  }

  private async ensurePermissionNameIsUnique(name: string, excludeId: string): Promise<void> {
    const existingPermission = await this.permissionRepository.findByName(name);
    if (existingPermission && existingPermission.id !== excludeId) {
      this.loggerService.warn(`Permission with name ${name} already exists`);
      throw new ConflictException('Permission with this name already exists');
    }
  }

  private async updatePermission(id: string, data: UpdatePermissionRequestDTO): Promise<PermissionModel> {
    return this.permissionRepository.update(id, {
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