import { UpdateRoleRequestDTO } from '@application/dtos/role/requests';
import { IRoleRepository, IPermissionRepository, ROLE_REPOSITORY, PERMISSION_REPOSITORY } from '@domain/interfaces/repositories';
import { RoleModel, RoleWithPermissions } from '@domain/models';
import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IBaseUseCase } from '../IBase.use-case';
import { LoggerService } from '@common/logger';
import { GetRoleDTO } from '@application/dtos/role/responses/get-role.dto';

@Injectable()
export class UpdateRoleUseCase implements IBaseUseCase<{ id: string; data: UpdateRoleRequestDTO }, GetRoleDTO> {
  constructor(
    @Inject(ROLE_REPOSITORY) private readonly roleRepository: IRoleRepository,
    @Inject(PERMISSION_REPOSITORY) private readonly permissionRepository: IPermissionRepository,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.context = this.constructor.name;
  }

  async execute({ id, data }: { id: string; data: UpdateRoleRequestDTO }): Promise<GetRoleDTO> {
    this.loggerService.log(`Updating role with id: ${id}, data: ${JSON.stringify(data)}`);

    const existingRole = await this.validateRoleExists(id);
    await this.validateRoleNameChange(data.name, existingRole);
    const permissionIds = await this.validateAndExtractPermissionIds(data.permissions);
    await this.updateRoleData(id, data);

    if (permissionIds) {
      await this.roleRepository.updateRolePermissions(id, permissionIds);
    }

    this.loggerService.log(`Role updated: ${existingRole.name}`);

    const roleWithPermissions = await this.roleRepository.findById(id, true) as RoleWithPermissions;

    return this.mapToGetRoleDTO(roleWithPermissions);
  }

  private async validateRoleExists(id: string): Promise<RoleModel> {
    const existingRole = await this.roleRepository.findById(id);

    if (!existingRole) {
      this.loggerService.warn(`Role with id ${id} not found`);
      throw new NotFoundException('Role not found');
    }

    return existingRole;
  }

  private async validateRoleNameChange(name: string | undefined, existingRole: RoleModel): Promise<void> {
    if (name && name.toLowerCase() !== existingRole.name.toLowerCase()) {
      const roleWithSameName = await this.roleRepository.findByName(name);
      if (roleWithSameName) {
        this.loggerService.warn(`Role with name ${name} already exists`);
        throw new ConflictException('Role with this name already exists');
      }
    }
  }

  private async validateAndExtractPermissionIds(permissions?: string[]): Promise<string[] | undefined> {
    if (!permissions) return;

    const permissionIds: string[] = [];
    for (const permission of permissions) {
      const existingPermission = await this.permissionRepository.findById(permission);
      if (!existingPermission) {
        throw new ConflictException(`Permission with id ${permission} not found`);
      }

      permissionIds.push(permission);
    }
    return permissionIds;
  }

  private async updateRoleData(id: string, data: UpdateRoleRequestDTO): Promise<void> {
    await this.roleRepository.update(id, {
      name: data.name,
      description: data.description,
    });
  }

  private mapToGetRoleDTO(role: RoleWithPermissions): GetRoleDTO {
    return {
      id: role.id,
      name: role.name,
      description: role.description,
      companyId: role.companyId || '',
      createdAt: role.createdAt,
      createdById: role.createdById || '',
      updatedAt: role.updatedAt || new Date(),
      updatedById: role.updatedById || '',
      deletedAt: role.deletedAt || new Date(),
      deletedById: role.deletedById || '',
      permissions: role.permissions?.map(permission => ({
        id: permission.permission.id,
        name: permission.permission.name,
        description: permission.permission.description,
      })) || [],
    };
  }
} 