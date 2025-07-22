import { IRoleRepository, ROLE_REPOSITORY } from '@domain/interfaces/repositories';
import { RoleModel, RoleWithPermissions } from '@domain/models';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IBaseUseCase } from '../IBase.use-case';
import { LoggerService } from '@common/logger';
import { GetRoleDTO } from '@application/dtos/role/responses/get-role.dto';

@Injectable()
export class GetRoleByIdUseCase implements IBaseUseCase<string, GetRoleDTO> {
  constructor(
    @Inject(ROLE_REPOSITORY) private readonly roleRepository: IRoleRepository,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.context = this.constructor.name;
  }

  async execute(id: string): Promise<GetRoleDTO> {
    this.loggerService.log(`Fetching role with id: ${id}`);

    const role = await this.roleRepository.findById(id, true);

    if (!role) {
      this.loggerService.warn(`Role with id ${id} not found`);
      throw new NotFoundException('Role not found');
    }

    this.loggerService.log(`Role found: ${role.name}`);

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
      permissions: (role as RoleWithPermissions).permissions?.map(permission => ({
        id: permission.permission.id,
        name: permission.permission.name,
        description: permission.permission.description,
      })),
    };
  }
} 