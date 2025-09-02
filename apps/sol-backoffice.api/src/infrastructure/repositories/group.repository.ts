import { CreateGroupInput, GroupModel, UpdateGroupInput } from '@domain/models';
import { IGroupRepository, IGroupRepositoryFindAllParams, IGroupRepositoryFindAllResult } from '@domain/interfaces/repositories';
import { DatabaseService } from '@infrastructure/database/database.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class GroupRepository implements IGroupRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(data: CreateGroupInput): Promise<GroupModel> {
    return await this.databaseService.group.create({
      data,
    });
  }

  async update(id: string, data: UpdateGroupInput): Promise<GroupModel> {
    return await this.databaseService.group.update({
      where: { id },
      data,
    });
  }

  async findById(id: string): Promise<GroupModel | null> {
    return await this.databaseService.group.findUnique({
      where: { id },
    });
  }

  async findAll(params?: IGroupRepositoryFindAllParams): Promise<IGroupRepositoryFindAllResult> {
    let whereClause: Prisma.GroupWhereInput = {
      deletedAt: null,
    };
    let orderBy: Prisma.GroupOrderByWithRelationInput = {
      name: 'asc',
    };

    if (params?.search) {
      whereClause = {
        ...whereClause,
        name: {
          contains: params.search,
          mode: 'insensitive',
        },
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

    const total = await this.databaseService.group.count({
      where: whereClause,
    });

    const data = await this.databaseService.group.findMany({
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

  async findByName(name: string): Promise<GroupModel | null> {
    return await this.databaseService.group.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive',
        },
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.databaseService.group.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
