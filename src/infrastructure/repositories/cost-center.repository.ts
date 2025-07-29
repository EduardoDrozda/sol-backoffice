import { ICostCenterRepository, ICostCenterRepositoryFindAllParams, ICostCenterRepositoryFindAllResult } from '@domain/interfaces/repositories';
import {
  CostCenterModel,
  CreateCostCenterInput,
  UpdateCostCenterInput,
} from '@domain/models';
import { DatabaseService } from '@infrastructure/database';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class CostCenterRepository implements ICostCenterRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  create(data: CreateCostCenterInput): Promise<CostCenterModel> {
    return this.databaseService.costCenter.create({
      data,
    });
  }

  async findAll(params?: ICostCenterRepositoryFindAllParams): Promise<ICostCenterRepositoryFindAllResult> {
    let whereClause: Prisma.CostCenterWhereInput = {
      deletedAt: null,
    };
    let orderBy: Prisma.CostCenterOrderByWithRelationInput = {
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

    const total = await this.databaseService.costCenter.count({
      where: whereClause,
    });

    const data = await this.databaseService.costCenter.findMany({
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

  findById(id: string): Promise<CostCenterModel | null> {
    return this.databaseService.costCenter.findUnique({
      where: {
        id,
      },
    });
  }

  findByName(name: string): Promise<CostCenterModel | null> {
    return this.databaseService.costCenter.findFirst({
      where: {
        name,
      },
    });
  }

  update(id: string, data: UpdateCostCenterInput): Promise<CostCenterModel> {
    const { description } = data;

    return this.databaseService.costCenter.update({
      where: {
        id,
      },
      data: {
        name: data.name,
        description,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.databaseService.costCenter.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
