import { IUserRepository, IUserRepositoryFindByEmailParams } from '@domain/interfaces/repositories';
import { CreateUserInput, CreateUserTokenInput, UserModel, UserTokenModel, UserWithRelations } from '@domain/models';
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

  async findById(id: string, params?: IUserRepositoryFindByEmailParams): Promise<UserWithRelations | null> {
    return this.databaseService.user.findFirst({
      where: { id },
      include: {
        role: params?.includeRole,
        company: params?.includeCompany,
        userTokens: params?.includeUserTokens
      },
    });
  }

  async findByUserToken(token: string): Promise<UserTokenModel | null> {
    return this.databaseService.userToken.findFirst({
      where: { token }
    });
  }

  async findAll(params?: IUserRepositoryFindByEmailParams): Promise<UserWithRelations[]> {
    return this.databaseService.user.findMany({
      include: {
        role: params?.includeRole,
        company: params?.includeCompany,
        userTokens: params?.includeUserTokens,
      },
    });
  }

  async create(user: CreateUserInput): Promise<UserModel> {
    return this.databaseService.user.create({
      data: user,
    });
  }

  async activateUser(id: string): Promise<void> {
    await this.databaseService.user.update({
      where: { id },
      data: { isActive: true },
    });
  }

  async createUserToken(data: CreateUserTokenInput): Promise<UserTokenModel> {
    return this.databaseService.userToken.create({
      data,
    });
  }

  async updatePassword(id: string, password: string): Promise<void> {
    await this.databaseService.user.update({
      where: { id },
      data: { password },
    });
  }

  async deleteUserToken(token: string): Promise<void> {
    await this.databaseService.userToken.deleteMany({
      where: { token },
    });
  }
}
