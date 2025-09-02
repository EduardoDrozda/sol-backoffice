import { IPermissionRepository, IPermissionRepositoryFindAllParams, IPermissionRepositoryFindAllResult } from "@domain/interfaces/repositories";
import { CreatePermissionInput, PermissionModel, UpdatePermissionInput } from "@domain/models";
import { DatabaseService } from "@infrastructure/database";
import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";

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

  async findAll(params?: IPermissionRepositoryFindAllParams): Promise<IPermissionRepositoryFindAllResult> {
    let whereClause: Prisma.PermissionWhereInput = {
      deletedAt: null,
    };
    let orderBy: Prisma.PermissionOrderByWithRelationInput = {
      name: 'asc',
    };

    if (params?.search) {
      whereClause = {
        ...whereClause,
        OR: [
          {
            name: {
              contains: params.search,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: params.search,
              mode: 'insensitive',
            },
          },
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

    const total = await this.databaseService.permission.count({
      where: whereClause,
    });

    const data = await this.databaseService.permission.findMany({
      where: whereClause,
      orderBy,
      skip,
      take: limit,
    });

    return {
      data,
      total,
    };
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