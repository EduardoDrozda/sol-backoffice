import { IRoleRepository, ROLE_REPOSITORY } from '@domain/interfaces/repositories';
import { RoleModel, RoleWithPermissions } from '@domain/models';
import { Inject, Injectable } from '@nestjs/common';
import { IBaseUseCase } from '../IBase.use-case';
import { LoggerService } from '@common/logger';
import { GetRoleDTO } from '@application/dtos/role/responses/get-role.dto';
import { GetPaginationBaseDto } from '@application/dtos/base/requests';
import { BaseResponseWithPaginationDto } from '@application/dtos/base/response';

@Injectable()
export class GetAllRolesUseCase implements IBaseUseCase<GetPaginationBaseDto, BaseResponseWithPaginationDto<GetRoleDTO>> {
  constructor(
    @Inject(ROLE_REPOSITORY) private readonly roleRepository: IRoleRepository,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.context = this.constructor.name;
  }

  async execute(data: GetPaginationBaseDto): Promise<BaseResponseWithPaginationDto<GetRoleDTO>> {
    const { page, limit, search, sort, order } = data;

    this.loggerService.log('Fetching all roles');
    const result = await this.getAllRolesWithPermissions({ search, sort, order, page, limit });
    this.loggerService.log(`Found ${result.total} roles total, showing ${result.data.length} in current page`);

    const mappedRoles: GetRoleDTO[] = result.data
      .filter((role: any) => Array.isArray((role as any).permissions))
      .map(role => this.mapToGetRoleDTO(role as RoleWithPermissions));

    const totalPages = Math.ceil(result.total / limit);

    return {
      data: mappedRoles,
      total: result.total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }

  private async getAllRolesWithPermissions(params?: { 
    search?: string; 
    sort?: string; 
    order?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }): Promise<{ data: RoleWithPermissions[]; total: number }> {
    const result = await this.roleRepository.findAll({
      includePermissions: true,
      search: params?.search,
      sort: params?.sort,
      order: params?.order,
      page: params?.page,
      limit: params?.limit,
    });
    
    return {
      data: result.data as RoleWithPermissions[],
      total: result.total,
    };
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