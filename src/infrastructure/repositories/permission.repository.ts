import { IPermissionRepository } from "@domain/interfaces/repositories";
import { CreatePermissionInput, PermissionModel, UpdatePermissionInput } from "@domain/models";
import { DatabaseService } from "@infrastructure/database";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PermissionRepository implements IPermissionRepository {
  constructor(private readonly databaseService: DatabaseService) { }

  async findById(id: string): Promise<PermissionModel | null> {
    return this.databaseService.permission.findUnique({
      where: { id },
    });
  }

  async findByName(name: string): Promise<PermissionModel | null> {
    return this.databaseService.permission.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive',
        },
      },
    });
  }

  async findAll(): Promise<PermissionModel[]> {
    return this.databaseService.permission.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async create(data: CreatePermissionInput): Promise<PermissionModel> {
    return this.databaseService.permission.create({
      data,
    });
  }

  async update(id: string, data: UpdatePermissionInput): Promise<PermissionModel> {
    return this.databaseService.permission.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.databaseService.permission.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }
} 