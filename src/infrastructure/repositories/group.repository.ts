import { CreateGroupInput, GroupModel, UpdateGroupInput } from '@domain/models';
import { IGroupRepository } from '@domain/interfaces/repositories';
import { DatabaseService } from '@infrastructure/database/database.service';
import { Injectable } from '@nestjs/common';

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

  async findAll(search?: string): Promise<GroupModel[]> {
    return await this.databaseService.group.findMany({
      where: {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
    });
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
