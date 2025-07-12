import { IUserRepository, IUserRepositoryFindByEmailParams } from '@domain/interfaces/repositories';
import { CreateUserInput, UserModel, UserWithRelations } from '@domain/models';
import { DatabaseService } from '@infrastructure/database';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findByEmail(email: string, params?: IUserRepositoryFindByEmailParams): Promise<any | null> {
    return this.databaseService.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: 'insensitive',
        },
      },
      include: {
        role: params?.includeRole,
        company: params?.includeCompany,
      },
    });
  }

  async create(user: CreateUserInput): Promise<UserModel> {
    return this.databaseService.user.create({
      data: user,
    });
  }

  async findById(id: string, params?: IUserRepositoryFindByEmailParams): Promise<UserWithRelations | null> {
    return this.databaseService.user.findFirst({
      where: { id },
      include: {
        role: params?.includeRole,
        company: params?.includeCompany,
      },
    });
  }
}
