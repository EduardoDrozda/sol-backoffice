import { IRoleRepository } from "@domain/interfaces/repositories";
import { RoleModel } from "@domain/models";
import { DatabaseService } from "@infrastructure/database";
import { Injectable } from "@nestjs/common";

@Injectable()
export class RoleRepository implements IRoleRepository {
  constructor(private readonly databaseService: DatabaseService) { }

  async findById(id: string, includePermissions?: boolean): Promise<RoleModel | null> {
    return this.databaseService.role.findUnique({
      where: { id },
      include: {
        permissions: {
          include: {
            permission: includePermissions,
          },
        },
      },
    });
  }

  async findByName(name: string, includePermissions?: boolean): Promise<any | null> {
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
            permission: includePermissions,
          },
        },
      },
    });
  }
}