import { CreateRoleRequestDTO } from '@application/dtos/role/requests';
import { IRoleRepository, IPermissionRepository, ROLE_REPOSITORY, PERMISSION_REPOSITORY } from '@domain/interfaces/repositories';
import { RoleWithPermissions } from '@domain/models';
import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { IBaseUseCase } from '../IBase.use-case';
import { LoggerService } from '@common/logger';
import { GetRoleDTO } from '@application/dtos/role/responses/get-role.dto';
import { AuthenticationService } from '@common/authentication';

@Injectable()
export class CreateRoleUseCase implements IBaseUseCase<CreateRoleRequestDTO, GetRoleDTO> {
  constructor(
    @Inject(ROLE_REPOSITORY) private readonly roleRepository: IRoleRepository,
    @Inject(PERMISSION_REPOSITORY) private readonly permissionRepository: IPermissionRepository,
    private readonly authenticationService: AuthenticationService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.context = this.constructor.name;
  }

  async execute(data: CreateRoleRequestDTO): Promise<GetRoleDTO> {
    this.loggerService.log(`Creating role with data: ${JSON.stringify(data)}`);
    await this.ensureRoleNameIsUnique(data.name);
    const permissionIds = await this.getValidPermissionIds(data.permissions);
    const createData = this.buildCreateData(data, permissionIds);
    const { id: newRoleId } = await this.createRole(createData);
    
    this.loggerService.log(`Role created with id: ${newRoleId}`);
    const newRole = await this.getRoleByIdWithPermissions(newRoleId);
    return this.mapToGetRoleDTO(newRole);
  }

  private async ensureRoleNameIsUnique(name: string): Promise<void> {
    const existingRole = await this.roleRepository.findByName(name);
    if (existingRole) {
      this.loggerService.warn(`Role with name ${name} already exists.`);
      throw new ConflictException('Role with this name already exists');
    }
  }

  private async getValidPermissionIds(permissions?: string[]): Promise<string[]> {
    const permissionIds: string[] = [];
    if (permissions && permissions.length > 0) {
      for (const permission of permissions) {
        const existingPermission = await this.permissionRepository.findById(permission);
        if (!existingPermission) {
          throw new ConflictException(`Permission with id ${permission} not found`);
        }
        permissionIds.push(permission);
      }
    }
    return permissionIds;
  }

  private buildCreateData(data: CreateRoleRequestDTO, permissionIds: string[]): any {
    const createData: any = {
      name: data.name,
      description: data.description,
    };
    if (permissionIds.length > 0) {
      createData.permissions = {
        create: permissionIds.map(permissionId => ({
          permission: {
            connect: { id: permissionId }
          }
        }))
      };
    }
    return createData;
  }

  private async createRole(createData: any) {
    const loggedUser = this.authenticationService.getSession();
    return this.roleRepository.create({
      ...createData,
      Company: {
        connect: {
          id: loggedUser?.user.companyId
        }
      }
    });
  }

  private async getRoleByIdWithPermissions(roleId: string): Promise<RoleWithPermissions> {
    return this.roleRepository.findById(roleId, true) as Promise<RoleWithPermissions>;
  }

  private mapToGetRoleDTO(newRole: RoleWithPermissions): GetRoleDTO {
    return {
      id: newRole.id,
      name: newRole.name,
      description: newRole?.description,
      companyId: newRole.companyId || '',
      createdAt: newRole.createdAt,
      createdById: newRole.createdById || '',
      updatedAt: newRole.updatedAt || new Date(),
      updatedById: newRole.updatedById || '',
      deletedAt: newRole.deletedAt || new Date(),
      deletedById: newRole.deletedById || '',
      permissions: newRole.permissions?.map(permission => ({
        id: permission.permission.id,
        name: permission.permission.name,
        description: permission.permission.description,
      })) || [],
    };
  }
} 