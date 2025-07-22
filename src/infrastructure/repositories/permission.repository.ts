import { IPermissionRepository } from "@domain/interfaces/repositories";
import { CreatePermissionInput, PermissionModel } from "@domain/models";
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

  async create(data: CreatePermissionInput): Promise<PermissionModel> {
    return this.databaseService.permission.create({
      data,
    });
  }
} 