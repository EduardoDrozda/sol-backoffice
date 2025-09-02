import { IProjectRepository, IProjectRepositoryFindAllParams, IProjectRepositoryFindAllResult } from '@domain/interfaces/repositories';
import {
  ProjectModel,
  CreateProjectInput,
  UpdateProjectInput,
} from '@domain/models';
import { DatabaseService } from '@infrastructure/database';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProjectRepository implements IProjectRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  create(data: CreateProjectInput): Promise<ProjectModel> {
    return this.databaseService.project.create({
      data,
    });
  }

  async findAll(params?: IProjectRepositoryFindAllParams): Promise<IProjectRepositoryFindAllResult> {
    let whereClause: Prisma.ProjectWhereInput = {
      deletedAt: null,
    };
    let orderBy: Prisma.ProjectOrderByWithRelationInput = {
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

    const total = await this.databaseService.project.count({
      where: whereClause,
    });

    const data = await this.databaseService.project.findMany({
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

  findById(id: string): Promise<ProjectModel | null> {
    return this.databaseService.project.findUnique({
      where: {
        id,
      },
    });
  }

  findByName(name: string): Promise<ProjectModel | null> {
    return this.databaseService.project.findFirst({
      where: {
        name,
      },
    });
  }

  update(id: string, data: UpdateProjectInput): Promise<ProjectModel> {
    const { description } = data;

    return this.databaseService.project.update({
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
    await this.databaseService.project.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
} 