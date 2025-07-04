import { ICostCenterRepository } from "@domain/interfaces/repositories";
import { CostCenterModel, CreateCostCenterInput, UpdateCostCenterInput } from "@domain/models";
import { DatabaseService } from "@infrastructure/database";
import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";

@Injectable()
export class CostCenterRepository implements ICostCenterRepository {
  constructor(private readonly databaseService: DatabaseService) { }

  create(data: CreateCostCenterInput): Promise<CostCenterModel> {
    console.log(data);
    return this.databaseService.costCenter.create({
      data
    });
  }

  findAll(filter?: string): Promise<CostCenterModel[]> {
    const params: Prisma.CostCenterFindManyArgs = {
      orderBy: {
        name: 'asc'
      }
    };

    if (filter) {
      params.where = {
        OR: [
          {
            name: {
              contains: filter,
              mode: "insensitive"
            }
          },
          {
            description: {
              contains: filter,
              mode: "insensitive"
            }
          }
        ]
      }
    }

    return this.databaseService.costCenter.findMany(params);
  }

  findById(id: string): Promise<CostCenterModel | null> {
    return this.databaseService.costCenter.findUnique({
      where: {
        id
      }
    });
  }

  findByName(name: string): Promise<CostCenterModel | null> {
    return this.databaseService.costCenter.findFirst({
      where: {
        name,
      }
    });
  }

  update(id: string, data: UpdateCostCenterInput): Promise<CostCenterModel> {
    const { description } = data;

    return this.databaseService.costCenter.update({
      where: {
        id
      },
      data: {
        name: data.name,
        description
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
      }
    });
  }
}