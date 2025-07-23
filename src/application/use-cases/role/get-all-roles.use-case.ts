import { IRoleRepository, ROLE_REPOSITORY } from '@domain/interfaces/repositories';
import { RoleModel, RoleWithPermissions } from '@domain/models';
import { Inject, Injectable } from '@nestjs/common';
import { IBaseUseCase } from '../IBase.use-case';
import { LoggerService } from '@common/logger';
import { GetRoleDTO } from '@application/dtos/role/responses/get-role.dto';

@Injectable()
export class GetAllRolesUseCase implements IBaseUseCase<void, GetRoleDTO[]> {
  constructor(
    @Inject(ROLE_REPOSITORY) private readonly roleRepository: IRoleRepository,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.context = this.constructor.name;
  }

  async execute(): Promise<GetRoleDTO[]> {
    this.loggerService.log('Fetching all roles');
    const roles = await this.getAllRolesWithPermissions();
    this.loggerService.log(`Found ${roles.length} roles`);
    return roles
      .filter((role: any) => Array.isArray((role as any).permissions))
      .map(role => this.mapToGetRoleDTO(role));
  }

  private async getAllRolesWithPermissions(): Promise<RoleWithPermissions[]> {
    return this.roleRepository.findAll(true) as Promise<RoleWithPermissions[]>;
  }

  private mapToGetRoleDTO(role: RoleWithPermissions): GetRoleDTO {
    return {
      id: role.id,
      name: role.name,
      description: role.description,
      companyId: role.companyId || '',
      createdAt: role.createdAt,
      createdById: role.createdById || '',
      updatedAt: role.updatedAt,
      updatedById: role.updatedById || '',
      deletedAt: role.deletedAt || new Date(),
      deletedById: role.deletedById || '',
      permissions: ((role as RoleWithPermissions).permissions?.map(permission => ({
        id: permission.permission.id,
        name: permission.permission.name,
        description: permission.permission.description,
      }))).sort((a, b) => a.name.localeCompare(b.name)) || [],
    };
  }
} 