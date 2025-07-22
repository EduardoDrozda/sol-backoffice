import { IRoleRepository } from "@domain/interfaces/repositories";
import { CreateRoleInput, RoleModel,  RoleWithPermissions,  UpdateRoleInput } from "@domain/models";
import { DatabaseService } from "@infrastructure/database";
import { Injectable } from "@nestjs/common";

@Injectable()
export class RoleRepository implements IRoleRepository {
  constructor(private readonly databaseService: DatabaseService) { }

  async findById(id: string, includePermissions?: boolean): Promise<RoleModel | RoleWithPermissions | null> {
    if (includePermissions) {
      return this.databaseService.role.findUnique({
        where: { id },
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
      where: { id },
    });
  }

  async findByName(name: string, includePermissions?: boolean): Promise<RoleModel | RoleWithPermissions | null> {
    if (includePermissions) {
      return this.databaseService.role.findFirst({
        where: {
          name: {
            equals: name,
            mode: 'insensitive',
          },
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
        },
      },
    });
  }

  async findAll(includePermissions?: boolean): Promise<RoleModel[] | RoleWithPermissions[]> {
    if (includePermissions) {
      return this.databaseService.role.findMany({
        where: {
          deletedAt: null,
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

    return this.databaseService.role.findMany({
      where: {
        deletedAt: null,
      },
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
      where: { id },
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
      where: { id },
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