import { IRoleRepository, IRoleRepositoryFindAllParams, IRoleRepositoryFindAllResult } from "@domain/interfaces/repositories";
import { CreateRoleInput, RoleModel,  RoleWithPermissions,  UpdateRoleInput } from "@domain/models";
import { DatabaseService } from "@infrastructure/database";
import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";

@Injectable()
export class RoleRepository implements IRoleRepository {
  constructor(private readonly databaseService: DatabaseService) { }

  async findById(id: string, includePermissions?: boolean): Promise<RoleModel | RoleWithPermissions | null> {
    if (includePermissions) {
      return this.databaseService.role.findUnique({
        where: { 
          id,
          deletedAt: null, // Filtrar apenas registros não deletados
        },
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
        },
      });
    }

    return this.databaseService.role.findUnique({
      where: { 
        id,
        deletedAt: null, // Filtrar apenas registros não deletados
      },
    });
  }

  async findByName(name: string, includePermissions?: boolean): Promise<RoleModel | RoleWithPermissions | null> {
    if (includePermissions) {
      return this.databaseService.role.findFirst({
        where: {
          name: {
            equals: name,
            mode: 'insensitive',
          }
        },
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
        },
      });
    }

    return this.databaseService.role.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive',
        }
      },
    });
  }

  async findAll(params?: IRoleRepositoryFindAllParams): Promise<IRoleRepositoryFindAllResult> {
    let whereClause: Prisma.RoleWhereInput = {
      deletedAt: null,
    };
    let orderBy: Prisma.RoleOrderByWithRelationInput = {};
    let include: Prisma.RoleInclude = {};

    if (params?.includePermissions) {
      include = {
        permissions: {
          include: {
            permission: true,
          },
        },
      };
    }

    if (params?.search) {
      whereClause = {
        ...whereClause,
        OR: [
          { name: { contains: params.search, mode: 'insensitive' } },
          { description: { contains: params.search, mode: 'insensitive' } },
        ],
      };
    }

    if (params?.sort && params?.order) {
      orderBy = {
        [params.sort]: params.order,
      };
    }

    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const skip = (page - 1) * limit;
  
    const total = await this.databaseService.role.count({
      where: whereClause,
    });

    const data = await this.databaseService.role.findMany({
      where: whereClause,
      include,
      orderBy,
      skip,
      take: limit,
    });

    return {
      data,
      total,
    };
  }

  async findAllSimple(): Promise<RoleModel[] | RoleWithPermissions[]> {
    return this.databaseService.role.findMany({
      where: { deletedAt: null },
    });
  }

  async create(data: CreateRoleInput): Promise<RoleWithPermissions> {
    return this.databaseService.role.create({
      data,
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });
  }

  async update(id: string, data: UpdateRoleInput): Promise<RoleWithPermissions> {
    return this.databaseService.role.update({
      where: { 
        id,
        deletedAt: null, // Garantir que só atualize registros não deletados
      },
      data,
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.databaseService.role.update({
      where: { 
        id,
        deletedAt: null, // Garantir que só delete registros não deletados
      },
      data: { deletedAt: new Date() }
    });
  }

  async updateRolePermissions(roleId: string, permissionIds: string[]): Promise<void> {
    
    await this.databaseService.rolePermission.deleteMany({
      where: { roleId }
    });

    if (permissionIds.length > 0) {
      await this.databaseService.rolePermission.createMany({
        data: permissionIds.map(permissionId => ({
          roleId,
          permissionId
        }))
      });
    }
  }
}